import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './env.js';
import { connectDB } from './db.js';
import { triageRouter } from './routes/triage.js';
import { chatRouter } from './routes/chat.js';
import { logsRouter } from './routes/logs.js';
import { metadataRouter } from './routes/metadata.js';
import patientRoutes from './routes/patientRoutes.js';
import { backfillMissingLogSpid } from './utils/backfill.js';

async function main() {
  await connectDB(env.MONGO_URI);
  const app = express();
  // Allow localhost Vite dev servers (5173/5174/etc.) and default to env when provided
  app.use(cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowEnv = env.ALLOW_ORIGIN;
      if (allowEnv && origin === allowEnv) return callback(null, true);
      const allowedLocal = /^http:\/\/(localhost|127\.0\.0\.1):51\d{2}$/; // e.g., 5173, 5174
      if (allowedLocal.test(origin)) return callback(null, true);
      // In dev, be permissive rather than failing CORS
      return callback(null, true);
    },
    credentials: true
  }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/triage', triageRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/logs', logsRouter);
  app.use('/api/metadata', metadataRouter);
  app.use('/api', patientRoutes);

  // Serve uploaded logo assets from the repo-level /logo folder
  // This allows the client to reference e.g. http://localhost:PORT/logo/logo(CareMate).png
  const logoDir = path.resolve(process.cwd(), '..', 'logo');
  app.use('/logo', express.static(logoDir));

  app.listen(env.PORT, () => console.log(`🚀 API on http://localhost:${env.PORT}`));

  // Fire-and-forget backfill to enrich legacy logs with missing SPID
  backfillMissingLogSpid()
    .then((r) => r.updated && console.log(`🔧 Backfilled SPID on ${r.updated} legacy triage logs`))
    .catch(() => {/* ignore */});
}
main();
