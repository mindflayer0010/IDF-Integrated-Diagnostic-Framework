import { Router } from 'express';
import { patientController } from '../controllers/patientController';

const router = Router();

// Patient routes
router.post('/patient', patientController.getOrCreatePatient);
router.get('/patient/:spid/history', patientController.getPatientHistory);
router.post('/patient/triage', patientController.saveTriageLog);

export default router;