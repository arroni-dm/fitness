import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer } from 'node:http';
import { leadsRouter } from './server/routes/leads.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  // Mount backend API routes
  app.use('/api', leadsRouter);

  // Catch-all for unknown /api routes so they never fall through to SPA HTML
  app.use('/api', (_req, res) => {
    res.status(404).json({
      ok: false,
      code: 'API_NOT_FOUND',
      message: 'Requested API endpoint does not exist.',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = createServer(app);
  const maxAttempts = process.env.NODE_ENV === 'production' ? 1 : 20;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const port = PORT + attempt;
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (error: NodeJS.ErrnoException) => {
          server.off('listening', onListening);
          reject(error);
        };
        const onListening = () => {
          server.off('error', onError);
          resolve();
        };
        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(port, '0.0.0.0');
      });
      console.info(`Server running on http://localhost:${port}`);
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EADDRINUSE') throw error;
      if (attempt === maxAttempts - 1) {
        throw new Error(`Port ${port} is already in use. Stop the other server or set PORT to an available port.`);
      }
      console.warn(`Port ${port} is already in use; trying ${port + 1}...`);
    }
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
