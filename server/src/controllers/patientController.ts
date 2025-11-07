import { Request, Response } from 'express';
import { Patient } from '../models/Patient';
import { TriageLog } from '../models/TriageLog';

export const patientController = {
  // Create or get patient by SPID
  async getOrCreatePatient(req: Request, res: Response) {
    try {
      const { spid } = req.body;
      const normSpid = String(spid || '').toUpperCase().replace(/^SPID/, 'SPID').replace(/^(?:SPID)?(\D*)/, 'SPID')
        ? `SPID${String(spid || '').toUpperCase().replace(/^SPID/, '').replace(/\D/g, '')}`
        : '';
      if (!/^(SPID\d{4,})$/.test(normSpid)) {
        return res.status(400).json({ error: 'Invalid SPID. Provide at least 4 digits (e.g., 1234) or SPID1234.' });
      }

      let patient = await Patient.findOne({ spid: normSpid });
      
      if (!patient) {
        patient = await Patient.create({ spid: normSpid });
      }

      // Get patient history
      const triageLogs = await TriageLog.find({ patientId: patient._id })
        .sort({ createdAt: -1 })
        .select('symptoms remedy createdAt notes explanation');

      // Normalize symptoms shape to Record<string, number>
      const history = triageLogs.map((log: any) => ({
        remedy: log.remedy,
        createdAt: log.createdAt,
        notes: log.notes,
        symptoms: Array.isArray(log.symptoms)
          ? Object.fromEntries(log.symptoms.map((s: any) => [s.name, s.urgencyScore]))
          : (log.symptoms || {}),
        explanation: (log as any).explanation || undefined
      }));

      return res.json({
        patient,
        history
      });
    } catch (error) {
      console.error('Error in getOrCreatePatient:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get patient history
  async getPatientHistory(req: Request, res: Response) {
    try {
      const { spid } = req.params;
      const normSpid = `SPID${String(spid || '').toUpperCase().replace(/^SPID/, '').replace(/\D/g, '')}`;
      const patient = await Patient.findOne({ spid: normSpid });
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      const triageLogs = await TriageLog.find({ patientId: patient._id })
        .sort({ createdAt: -1 })
        .select('symptoms remedy createdAt notes explanation');

      const history = triageLogs.map((log: any) => ({
        remedy: log.remedy,
        createdAt: log.createdAt,
        notes: log.notes,
        symptoms: Array.isArray(log.symptoms)
          ? Object.fromEntries(log.symptoms.map((s: any) => [s.name, s.urgencyScore]))
          : (log.symptoms || {}),
        explanation: (log as any).explanation || undefined
      }));

      return res.json({ history });
    } catch (error) {
      console.error('Error in getPatientHistory:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Save new triage log for patient
  async saveTriageLog(req: Request, res: Response) {
    try {
      const { spid, symptoms, remedy, notes } = req.body;
      const normSpid = `SPID${String(spid || '').toUpperCase().replace(/^SPID/, '').replace(/\D/g, '')}`;
      
      // Find or create patient automatically to avoid client-side race/ordering issues
      let patient = await Patient.findOne({ spid: normSpid });
      if (!patient) {
        patient = await Patient.create({ spid: normSpid });
      }

      const triageLog = await TriageLog.create({
        patientId: patient._id,
        spid: normSpid,
        symptoms,
        remedy,
        notes
      });

      return res.json(triageLog);
    } catch (error) {
      console.error('Error in saveTriageLog:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};