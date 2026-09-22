import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { MetricServiceClient } from '@google-cloud/monitoring';

// Carrega configurações do projeto Firebase
let firebaseConfig: any = {};
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Não foi possível ler firebase-applet-config.json:', e);
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.projectId || 'gen-lang-client-0277873219';
const databaseId = process.env.FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || '(default)';

// Inicializa Firebase Admin SDK (Cloud Run usa Application Default Credentials automaticamente)
let adminApp: App | null = null;
try {
  if (getApps().length === 0) {
    adminApp = initializeApp({ projectId });
  } else {
    adminApp = getApps()[0];
  }
} catch (e) {
  console.warn('Aviso ao inicializar Firebase Admin App:', e);
}

// Inicializa Firestore Admin
let firestoreAdmin: Firestore | null = null;
try {
  if (adminApp) {
    firestoreAdmin = databaseId && databaseId !== '(default)'
      ? getFirestore(adminApp, databaseId)
      : getFirestore(adminApp);
  }
} catch (e) {
  console.warn('Aviso ao inicializar Firestore Admin:', e);
}

// Inicializa MetricServiceClient para Cloud Monitoring (ADC nativo no Cloud Run)
let metricClient: MetricServiceClient | null = null;
try {
  metricClient = new MetricServiceClient({ projectId });
} catch (e) {
  console.warn('Aviso ao inicializar MetricServiceClient:', e);
}

const ADMIN_EMAILS = [
  'wrobel.marcos@gmail.com',
  'marcos.wrobel@prof.educacao.sp.gov.br'
];

// Cache em memória para métricas (TTL de 3 minutos para respeitar cota e auto-refresh)
interface CachedMetrics {
  timestamp: number;
  data: any;
}
let metricsCache: CachedMetrics | null = null;
const METRICS_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutos

// Cotas Spark diárias do Firestore
const SPARK_DAILY_READS_QUOTA = 50000;
const SPARK_DAILY_WRITES_QUOTA = 20000;

// Middleware para verificar autorização de Administrador via Firebase Auth ID Token
async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Não autenticado. Forneça o token Bearer no cabeçalho Authorization.'
    });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Token vazio.' });
  }

  try {
    const authAdmin = getAuth(adminApp || undefined);
    const decoded = await authAdmin.verifyIdToken(token);
    const email = decoded.email?.trim().toLowerCase() || '';

    // Verifica se é administrador master
    const isMasterAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email);

    // Também verifica se está registrado na lista de professores autorizados em /system/settings
    let isAllowedTeacher = false;
    if (!isMasterAdmin && firestoreAdmin) {
      try {
        const settingsDoc = await firestoreAdmin.collection('system').doc('settings').get();
        if (settingsDoc.exists) {
          const settings = settingsDoc.data();
          if (Array.isArray(settings?.allowedTeachers)) {
            isAllowedTeacher = settings.allowedTeachers.some(
              (t: string) => t.trim().toLowerCase() === email
            );
          }
        }
      } catch (err) {
        // Ignora erro de leitura em fallback
      }
    }

    if (!isMasterAdmin && !isAllowedTeacher) {
      return res.status(403).json({
        error: 'Acesso negado. Apenas administradores e docentes autorizados podem acessar métricas do Firestore.'
      });
    }

    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.warn('Falha na validação do token de admin:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// Consulta métricas de consumo de leitura e escrita no Cloud Monitoring
async function fetchCloudMonitoringMetrics(targetProjectId: string): Promise<{ reads: number; writes: number } | null> {
  if (!metricClient) return null;

  try {
    const projectName = metricClient.projectPath(targetProjectId);

    // Início do dia UTC (00:00:00Z) até agora
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));

    const startTime = { seconds: Math.floor(startOfDay.getTime() / 1000) };
    const endTime = { seconds: Math.floor(now.getTime() / 1000) };

    // Consulta de Leituras (document/read_count)
    const [readsSeries] = await metricClient.listTimeSeries({
      name: projectName,
      filter: 'metric.type = "firestore.googleapis.com/document/read_count"',
      interval: { startTime, endTime },
      aggregation: {
        alignmentPeriod: { seconds: 86400 },
        perSeriesAligner: 'ALIGN_SUM',
        crossSeriesReducer: 'REDUCE_SUM'
      }
    });

    // Consulta de Escritas (document/write_count)
    const [writesSeries] = await metricClient.listTimeSeries({
      name: projectName,
      filter: 'metric.type = "firestore.googleapis.com/document/write_count"',
      interval: { startTime, endTime },
      aggregation: {
        alignmentPeriod: { seconds: 86400 },
        perSeriesAligner: 'ALIGN_SUM',
        crossSeriesReducer: 'REDUCE_SUM'
      }
    });

    let totalReads = 0;
    if (readsSeries && readsSeries.length > 0) {
      for (const s of readsSeries) {
        if (s.points) {
          for (const pt of s.points) {
            totalReads += Number(pt.value?.int64Value || 0);
          }
        }
      }
    }

    let totalWrites = 0;
    if (writesSeries && writesSeries.length > 0) {
      for (const s of writesSeries) {
        if (s.points) {
          for (const pt of s.points) {
            totalWrites += Number(pt.value?.int64Value || 0);
          }
        }
      }
    }

    return { reads: totalReads, writes: totalWrites };
  } catch (err: any) {
    console.warn('Cloud Monitoring API indisponível ou sem credenciais ADC locais:', err.message);
    return null;
  }
}

// Contagem rápida de alunos registrados usando agregação eficiente
async function fetchTotalStudentsCount(): Promise<number> {
  if (!firestoreAdmin) return 0;
  try {
    const snapshot = await firestoreAdmin.collection('saves').count().get();
    return snapshot.data().count || 0;
  } catch (err: any) {
    console.warn('Erro ao contar documentos de saves via Firestore Admin:', err.message);
    return 0;
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware para processar JSON
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Endpoint de Métricas do Firestore para o Painel Administrativo
  app.get('/api/admin/firestore-metrics', requireAdmin, async (req, res) => {
    const force = req.query.force === 'true';
    const now = Date.now();

    // Retorna cache em memória se ainda válido (TTL 3 minutos)
    if (!force && metricsCache && now - metricsCache.timestamp < METRICS_CACHE_TTL_MS) {
      return res.json({
        ...metricsCache.data,
        isFromCache: true,
        cachedSecondsAgo: Math.round((now - metricsCache.timestamp) / 1000)
      });
    }

    // Consulta métricas
    const gcpMetrics = await fetchCloudMonitoringMetrics(projectId);
    const studentsCount = await fetchTotalStudentsCount();

    const readsUsed = gcpMetrics ? gcpMetrics.reads : 0;
    const writesUsed = gcpMetrics ? gcpMetrics.writes : 0;
    const source = gcpMetrics ? 'cloud_monitoring' : 'fallback_local';

    const memoryUsage = process.memoryUsage();
    const memoryRssMb = Math.round((memoryUsage.rss / 1024 / 1024) * 10) / 10;

    const data = {
      reads: {
        used: readsUsed,
        quota: SPARK_DAILY_READS_QUOTA,
        percent: Number(((readsUsed / SPARK_DAILY_READS_QUOTA) * 100).toFixed(2))
      },
      writes: {
        used: writesUsed,
        quota: SPARK_DAILY_WRITES_QUOTA,
        percent: Number(((writesUsed / SPARK_DAILY_WRITES_QUOTA) * 100).toFixed(2))
      },
      studentsCount,
      server: {
        status: (readsUsed > SPARK_DAILY_READS_QUOTA * 0.9 || writesUsed > SPARK_DAILY_WRITES_QUOTA * 0.9) ? 'warning' : 'normal',
        uptimeSeconds: Math.floor(process.uptime()),
        memoryRssMb,
        environment: process.env.K_SERVICE ? 'Google Cloud Run' : 'Node.js Express Local'
      },
      latencyNotice: '⏱️ Métricas consolidadas com ~3-5 min de atraso via GCP.',
      source,
      timestamp: new Date().toISOString(),
      cacheTtlSeconds: Math.round(METRICS_CACHE_TTL_MS / 1000)
    };

    metricsCache = {
      timestamp: now,
      data
    };

    return res.json({
      ...data,
      isFromCache: false,
      cachedSecondsAgo: 0
    });
  });

  // Vite middleware em desenvolvimento / Servidor de arquivos estáticos em produção
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TypeClicker Server rodando em http://localhost:${PORT}`);
  });
}

startServer();
