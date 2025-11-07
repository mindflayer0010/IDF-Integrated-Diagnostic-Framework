import { Router } from 'express';
import { triageSchema } from '../utils/validation';
import { scoreTriage } from '../services/triageEngine';
import { TriageLog } from '../models/TriageLog';
import { Patient } from '../models/Patient';
import fs from 'fs';
import path from 'path';

// Load canonical symptoms once (from the same CSV used by /metadata)
const CSV_PATH = path.join(process.cwd(), '..', 'artifacts', 'data', 'Balanced_SPID_Dataset.csv');
let CANONICAL_SYMPTOMS: string[] = [];
try {
  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  const firstLine = csv.split('\n')[0] ?? '';
  const headers = firstLine.split(',').map(h => h.trim());
  CANONICAL_SYMPTOMS = headers.filter(h => !['SPID', 'Remedy', 'UrgencyScore', 'UrgencyCategory', 'UrgencyCategoryEncoded', 'Condition'].includes(h));
} catch {
  // Safe fallback; predict.py will still default missing cols to 0
  CANONICAL_SYMPTOMS = [];
}

const canonicalMap = new Map(CANONICAL_SYMPTOMS.map(s => [s.trim().toLowerCase(), s]));

function normalizeSymptoms(input: Record<string, number>) {
  const normalized: Record<string, number> = {};
  const unknown: string[] = [];
  for (const [k, v] of Object.entries(input || {})) {
    const key = (k ?? '').toString().trim().toLowerCase();
    const canon = canonicalMap.get(key);
    if (canon) {
      normalized[canon] = v;
    } else {
      unknown.push(k);
    }
  }
  return { normalized, unknown };
}

export const triageRouter = Router();

triageRouter.post('/', async (req, res) => {
  const parse = triageSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { symptoms, age, gender, notes, emotion, spid } = parse.data;
  const normSpid = (() => {
    const s = String(spid || '').toUpperCase();
    const digits = s.replace(/^SPID/i, '').replace(/\D/g, '');
    return `SPID${digits}`;
  })();
  // Case-insensitive normalization against canonical columns
  const { normalized, unknown } = normalizeSymptoms(symptoms);
  const finalSymptoms = Object.keys(normalized).length > 0 ? normalized : symptoms;
  if (unknown.length && Object.keys(normalized).length === 0 && CANONICAL_SYMPTOMS.length) {
    return res.status(400).json({ error: `Invalid symptoms: ${JSON.stringify(unknown)}. Valid: ${JSON.stringify(CANONICAL_SYMPTOMS)}` });
  }
  try {
    const { predicted, dosage, composition, explanation, fallbackUsed } = await scoreTriage({ symptoms: finalSymptoms, age, gender });
    const ageCategory = getAgeCategory(age); // Helper function
    let log = null;
    try {
      // find or create patient by SPID
      let patient = await Patient.findOne({ spid: normSpid });
      if (!patient) {
        patient = await Patient.create({ spid: normSpid });
      }

      log = await TriageLog.create({
  patientId: patient._id,
  spid: normSpid,
        symptoms: finalSymptoms,
        age,
        gender,
        ageCategory,
        remedy: predicted?.Remedy || undefined,
        predicted,
        dosage,
        composition,
        explanation: explanation || undefined,
        fallbackUsed,
        notes,
        emotion
      });

      // keep back-reference for convenience (non-blocking)
      try {
        await Patient.updateOne({ _id: patient._id }, { $addToSet: { triageLogs: log._id } });
      } catch {}
    } catch (dbError) {
      const errMsg = dbError instanceof Error ? dbError.message : String(dbError);
      console.log('DB save failed, continuing without logging:', errMsg);
    }
    res.json({ predicted, dosage, composition, explanation: explanation || null, fallbackUsed, logId: log?._id || null });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: msg });
  }
});

function getAgeCategory(age: number): string {
  if (age <= 12) return "Child";
  else if (age <= 18) return "Adolescent";
  else if (age <= 60) return "Adult";
  else return "Senior";
}
