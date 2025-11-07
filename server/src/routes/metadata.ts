import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const metadataRouter = Router();

metadataRouter.get('/symptoms', async (_req, res) => {
  try {
  // Resolve CSV from artifacts/data folder (where datasets live in this workspace)
  const csvPath = path.join(process.cwd(), '..', 'artifacts', 'data', 'Balanced_SPID_Dataset.csv');
    console.log('CSV Path:', csvPath);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const symptomColumns = headers.filter(h => !['SPID', 'Remedy', 'UrgencyScore', 'UrgencyCategory', 'UrgencyCategoryEncoded', 'Condition'].includes(h.trim()));
    res.json(symptomColumns);
  } catch (error) {
    console.error('Error reading CSV:', error);
    res.status(500).json({ error: 'Failed to read symptom metadata' });
  }
});
