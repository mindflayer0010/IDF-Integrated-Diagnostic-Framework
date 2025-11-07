import { Router } from 'express';
export const chatRouter = Router();
chatRouter.post('/', async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message required' });
  // Stubbed response
  res.json({ reply: `I heard: ${message}. Tell me your symptoms to begin triage.` });
});
