import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.disable('x-powered-by');

  // Cabeçalhos de segurança básicos (sem CSP: ver BACKLOG — requer mapear Monaco/Firebase/Supabase)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Middleware para processar JSON (as rotas atuais são GET; limite pequeno reduz superfície de abuso)
  app.use(express.json({ limit: '100kb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });


  // Configuração do Supabase (lê de process.env com suporte a aliases ou de supabase-applet-config.json)
  let supabaseConfigFile: any = {};
  try {
    const supabaseConfigPath = path.resolve(process.cwd(), 'supabase-applet-config.json');
    if (fs.existsSync(supabaseConfigPath)) {
      supabaseConfigFile = JSON.parse(fs.readFileSync(supabaseConfigPath, 'utf-8'));
    }
  } catch (e) {
    console.warn('Não foi possível ler supabase-applet-config.json:', e);
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
    || process.env.SUPABASE_URL
    || process.env.VITA_SUPABASE_URL
    || supabaseConfigFile.supabaseUrl
    || supabaseConfigFile.VITE_SUPABASE_URL
    || '';

  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.SUPABASE_KEY
    || process.env.VITA_SUPABASE_ANON_KEY
    || supabaseConfigFile.supabaseAnonKey
    || supabaseConfigFile.VITE_SUPABASE_ANON_KEY
    || '';

  const dbProvider = process.env.VITE_DB_PROVIDER
    || process.env.DB_PROVIDER
    || (supabaseUrl ? 'supabase' : 'firestore');

  // Endpoint informativo da saúde e variáveis de ambiente públicas
  app.get('/api/env-config', (req, res) => {
    res.json({
      dbProvider,
      isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')),
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseKey: Boolean(supabaseAnonKey),
      environment: process.env.K_SERVICE ? 'Google Cloud Run (AI Studio)' : (process.env.NODE_ENV || 'development')
    });
  });

  // Vite middleware em desenvolvimento / Servidor com injeção de runtime em produção
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');

    // Injeta variáveis de ambiente de runtime no index.html servido ao navegador
    const getInjectedIndexHtml = () => {
      if (!fs.existsSync(indexPath)) return null;
      const rawHtml = fs.readFileSync(indexPath, 'utf-8');
      const envPayload = JSON.stringify({
        VITE_SUPABASE_URL: supabaseUrl,
        VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
        VITE_DB_PROVIDER: dbProvider,
        VITE_SUPABASE_FIREBASE_AUTH: process.env.VITE_SUPABASE_FIREBASE_AUTH || 'false'
      }).replace(/</g, '\\u003c');

      const injectionScript = `
    <script id="__APP_ENV__">
      window.__APP_ENV__ = ${envPayload};
    </script>
  </head>`;
      return rawHtml.replace('</head>', injectionScript);
    };

    let cachedHtml = getInjectedIndexHtml();

    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      const html = cachedHtml || getInjectedIndexHtml();
      if (html) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } else {
        res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TypeClicker Server rodando em http://localhost:${PORT}`);
  });
}

startServer();
