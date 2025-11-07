import { Router } from 'express';
import { TriageLog } from '../models/TriageLog';
export const logsRouter = Router();

// Recent flat list (kept for backward compatibility)
logsRouter.get('/', async (_req, res) => {
  const docs = await TriageLog.find().sort({ createdAt: -1 }).limit(25).populate('patientId', 'spid').lean();
  const logs = docs.map(d => ({ ...d, spid: d.spid || (d as any).patientId?.spid || null }));
  res.json(logs);
});

// Grouped by Today and Yesterday for doctor's dashboard
logsRouter.get('/daily', async (_req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const [todayDocs, yesterdayDocs] = await Promise.all([
      TriageLog.find({ createdAt: { $gte: startOfToday } })
        .sort({ createdAt: -1 })
        .populate('patientId', 'spid')
        .lean(),
      TriageLog.find({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } })
        .sort({ createdAt: -1 })
        .populate('patientId', 'spid')
        .lean()
    ]);

    const todayLogs = todayDocs.map(d => ({ ...d, spid: d.spid || (d as any).patientId?.spid || null }));
    const yesterdayLogs = yesterdayDocs.map(d => ({ ...d, spid: d.spid || (d as any).patientId?.spid || null }));

    res.json({ today: todayLogs, yesterday: yesterdayLogs });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: msg });
  }
});
