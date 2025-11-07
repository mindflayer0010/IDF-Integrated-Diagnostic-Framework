import { TriageLog } from '../models/TriageLog';
import { Patient } from '../models/Patient';

/**
 * One-time/idempotent backfill to copy Patient.spid into TriageLog.spid
 * for legacy records created before the spid field existed.
 */
export async function backfillMissingLogSpid(): Promise<{ updated: number }>{
  let updated = 0;
  // Fetch a limited batch size to avoid large memory usage in big datasets
  const batchSize = 500;
  /* eslint-disable no-constant-condition */
  while (true) {
    const missing = await TriageLog.find({
      $and: [
        { $or: [ { spid: { $exists: false } }, { spid: null }, { spid: '' } ] },
        { patientId: { $exists: true, $ne: null } }
      ]
    })
      .select('patientId spid')
      .limit(batchSize)
      .lean();

    if (!missing.length) break;

    const patientIds = [...new Set(missing.map(m => String(m.patientId)))];
    const patients = await Patient.find({ _id: { $in: patientIds } }).select('spid').lean();
    const pMap = new Map(patients.map(p => [String(p._id), p.spid]));

    for (const m of missing) {
      const spid = pMap.get(String(m.patientId));
      if (spid) {
        await TriageLog.updateOne({ _id: m._id }, { $set: { spid } });
        updated += 1;
      }
    }
  }

  return { updated };
}
