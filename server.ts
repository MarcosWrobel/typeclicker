import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHjXlcwmbLhZsYg8lfXzXGAELubWr5qF89wnA09vygr-RpPbypHnPV2Q_Ym3v2IX2W5Q/exec';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware para processar JSON com limite adequado para save states
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Salvar progresso na planilha do Google Sheets via Webhook
  app.post('/api/sheet/save', async (req, res) => {
    try {
      const payload = {
        action: 'save',
        ...req.body
      };

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const text = await response.text();

      // Detecção de restrição de permissão do Google Apps Script
      if (
        text.includes('You need access') ||
        text.includes('accounts.google.com') ||
        text.includes('docs.google.com/accounts') ||
        response.status === 401 ||
        response.status === 403
      ) {
        return res.status(200).json({
          success: false,
          needsPermission: true,
          message: 'Permissão necessária no Google Apps Script: No Google Sheets, vá em Extensões > Apps Script > Implantar > Gerenciar Implantações > Editar (ícone lápis), e mude "Quem pode acessar" para "Qualquer pessoa" (Anyone).'
        });
      }

      if (text.includes('Page Not Found') || text.includes('unable to open the file at this time')) {
        return res.status(200).json({
          success: false,
          message: 'Erro do Google Apps Script: "Página não encontrada". A URL do Webhook pode estar incorreta ou você esqueceu de publicar como "Nova Versão".'
        });
      }

      if (text.includes('Script function not found: doGet') || text.includes('Script function not found: doPost')) {
         return res.status(200).json({
          success: false,
          message: 'Erro do Google Apps Script: O script requer a função doPost(e), mas ela não foi encontrada. Verifique se o código Code.gs foi colado corretamente na planilha.'
        });
      }

      if (text.startsWith('<!DOCTYPE html>')) {
        return res.status(200).json({
          success: false,
          message: 'O Google Apps Script bloqueou o acesso e retornou uma página HTML em vez de JSON.'
        });
      }

      let parsedResult: any = {};
      try {
        parsedResult = JSON.parse(text);
      } catch {
        // Fallback for HTML errors from Google Apps Script
        if (text.includes('Page Not Found') || text.includes('unable to open the file at this time')) {
          return res.status(200).json({
            success: false,
            message: 'Erro: O Google Apps Script retornou "Página não encontrada". A URL do Webhook pode estar incorreta ou o deploy não foi publicado.'
          });
        }
        if (text.includes('Script function not found: doGet') || text.includes('Script function not found: doPost')) {
          return res.status(200).json({
            success: false,
            message: 'Erro: O script no Google Sheets não possui a função doPost(e). Verifique se o código Code.gs foi colado corretamente.'
          });
        }
        if (text.startsWith('<!DOCTYPE html>')) {
          return res.status(200).json({
            success: false,
            message: 'O Google bloqueou o acesso (Erro HTML genérico). Verifique se a implantação está como "Qualquer pessoa".'
          });
        }

        parsedResult = { success: false, message: 'Resposta inválida da planilha: ' + text.substring(0, 50) };
      }

      return res.status(200).json({
        success: parsedResult.success !== false,
        message: parsedResult.message || 'Progresso registrado na planilha com sucesso!',
        data: parsedResult
      });
    } catch (error: any) {
      console.error('Erro ao conectar ao Google Apps Script:', error);
      return res.status(200).json({
        success: false,
        message: `Falha ao conectar com o Google Sheets: ${error.message || 'Erro de comunicação.'}`
      });
    }
  });

  // Carregar progresso da planilha do Google Sheets
  app.post('/api/sheet/load', async (req, res) => {
    try {
      const { nome, turma } = req.body;
      if (!nome || !turma) {
        return res.status(200).json({
          success: false,
          message: 'Nome e Turma são obrigatórios para buscar o progresso.'
        });
      }

      const payload = {
        action: 'load',
        nome: String(nome).trim(),
        turma: String(turma).trim()
      };

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const text = await response.text();

      // Detecção de restrição de permissão do Google Apps Script
      if (
        text.includes('You need access') ||
        text.includes('accounts.google.com') ||
        text.includes('docs.google.com/accounts') ||
        response.status === 401 ||
        response.status === 403
      ) {
        return res.status(200).json({
          success: false,
          needsPermission: true,
          message: 'Permissão necessária no Google Apps Script: No Google Sheets, vá em Extensões > Apps Script > Implantar > Gerenciar Implantações > Editar (ícone lápis), e mude "Quem pode acessar" para "Qualquer pessoa" (Anyone).'
        });
      }

      if (text.includes('Page Not Found') || text.includes('unable to open the file at this time')) {
        return res.status(200).json({
          success: false,
          message: 'Erro do Google Apps Script: "Página não encontrada". A URL do Webhook pode estar incorreta ou você esqueceu de publicar como "Nova Versão".'
        });
      }

      if (text.includes('Script function not found: doGet') || text.includes('Script function not found: doPost')) {
         return res.status(200).json({
          success: false,
          message: 'Erro do Google Apps Script: O script requer a função doPost(e), mas ela não foi encontrada. Verifique se o código Code.gs foi colado corretamente na planilha.'
        });
      }

      if (text.startsWith('<!DOCTYPE html>')) {
        return res.status(200).json({
          success: false,
          message: 'O Google Apps Script bloqueou o acesso e retornou uma página HTML em vez de JSON.'
        });
      }

      let parsedResult: any = {};
      try {
        parsedResult = JSON.parse(text);
      } catch {
        // Fallback for HTML errors from Google Apps Script
        if (text.includes('Page Not Found') || text.includes('unable to open the file at this time')) {
          return res.status(200).json({
            success: false,
            message: 'Erro: O Google Apps Script retornou "Página não encontrada". A URL do Webhook pode estar incorreta.'
          });
        }
        if (text.includes('Script function not found: doGet') || text.includes('Script function not found: doPost')) {
          return res.status(200).json({
            success: false,
            message: 'Erro: O script no Google Sheets não possui a função doPost(e). Verifique se o código Code.gs foi colado corretamente.'
          });
        }
        if (text.startsWith('<!DOCTYPE html>')) {
          return res.status(200).json({
            success: false,
            message: 'O Google bloqueou o acesso (Erro HTML genérico). Verifique se a implantação está como "Qualquer pessoa".'
          });
        }

        return res.status(200).json({
          success: false,
          message: 'Resposta inválida recebida da planilha: ' + text.substring(0, 50)
        });
      }

      const rawSave = parsedResult.saveState || parsedResult.save;

      if (parsedResult.success === false || !rawSave) {
        return res.status(200).json({
          success: false,
          message: parsedResult.message || `Nenhum save encontrado para ${nome} (${turma}).`
        });
      }

      let finalSaveState = rawSave;
      
      // Desempacota o JSON iterativamente para evitar bugs de "string dupla" (ex: "{\"bytes\":100}")
      let parseAttempts = 0;
      while (typeof finalSaveState === 'string' && parseAttempts < 3) {
        try {
          finalSaveState = JSON.parse(finalSaveState);
        } catch (e) {
          console.error("Erro ao parsear o save string iterativamente:", e);
          break;
        }
        parseAttempts++;
      }

      if (typeof finalSaveState !== 'object' || finalSaveState === null || Array.isArray(finalSaveState)) {
        return res.status(200).json({
          success: false,
          message: 'O save encontrado na planilha está em um formato antigo indisponível ou corrompido. Jogue um pouco e salve novamente por cima para recriá-lo corretamente.'
        });
      }

      return res.status(200).json({
        success: true,
        message: `Save de ${nome} carregado com sucesso!`,
        saveState: finalSaveState,
        savedAt: parsedResult.timestamp || parsedResult.savedAt,
        level: parsedResult.level,
        points: parsedResult.points
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados do Google Apps Script:', error);
      return res.status(200).json({
        success: false,
        message: `Falha ao buscar save na planilha: ${error.message || 'Erro de comunicação.'}`
      });
    }
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
