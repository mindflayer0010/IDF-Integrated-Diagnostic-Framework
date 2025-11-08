import { useState, useEffect } from 'react';
import { postJSON, getJSON } from '../lib/api';
import SymptomHoneycomb from './SymptomHoneycomb';
import SymptomLegend from './SymptomLegend';

type Result = { predicted: { UrgencyScore: number | null; UrgencyCategory: string | null; Remedy: string }; dosage: { Concentration: string | null; Dosage: string; Timing: string | null; 'Age Category': string; Gender: string }; composition: { Remedy: string; Source: string; 'Chemical Composition': string }; explanation: string; fallbackUsed: boolean; logId: string | null };

interface PatientHistory {
  symptoms: Record<string, number>;
  remedy: string;
  createdAt: string;
  notes?: string;
  explanation?: string;
}

export default function SymptomForm({ onResult }: { onResult: (r: Result)=>void }){
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  // Honeycomb replaces manual add/select UI
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('M');
  const [loading, setLoading] = useState(false);
  const [symptomList, setSymptomList] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [spidDigits, setSpidDigits] = useState('');
  const [isValidSpid, setIsValidSpid] = useState(false);
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    getJSON('/api/metadata/symptoms').then(setSymptomList).catch(console.error);
  }, []);

  const validateSpidDigits = (value: string) => {
    // Accept at least 4 digits; server will store as SPID####
    const isValid = /^\d{4,}$/.test(value);
    setIsValidSpid(isValid);
    return isValid;
  };

  const fetchPatientHistory = async (patientSpid: string) => {
    try {
      const data = await getJSON(`/api/patient/${patientSpid}/history`);
      setPatientHistory(data?.history || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient history');
    }
  };

  const handleSpidDigitsChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    setSpidDigits(digits);
    if (validateSpidDigits(digits)) {
      fetchPatientHistory(`SPID${digits}`);
    }
  };

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if (!isValidSpid) {
      setError('Please enter a valid SPID (SPID followed by 4 digits)');
      return;
    }
    
    setLoading(true);
    try {
      const payload = { spid: `SPID${spidDigits}`, symptoms, age, gender };
      const data = await postJSON('/api/triage', payload);
      onResult(data);
      // Refresh patient history after successful submission
      await fetchPatientHistory(`SPID${spidDigits}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit triage data');
    } finally {
      setLoading(false);
    }
  }

  const filteredSymptoms = filterQuery
    ? symptomList.filter((s) => s.toLowerCase().includes(filterQuery.toLowerCase()))
    : symptomList;

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow grid gap-3" noValidate>
        <label className="grid gap-1" htmlFor="spid-input">
          <span className="text-sm text-zinc-600">Patient ID (SPID)</span>
          <div className={`flex items-center border rounded ${!spidDigits || isValidSpid ? '' : 'border-red-500'}`}>
            <span className="px-3 py-2 text-zinc-500 select-none">SPID</span>
            <input
              id="spid-input"
              name="spid"
              type="text"
              inputMode="numeric"
              pattern="\d{4,}"
              aria-invalid={spidDigits ? (!isValidSpid) : undefined}
              value={spidDigits}
              onChange={e => handleSpidDigitsChange(e.target.value)}
              className="flex-1 px-3 py-2 outline-none"
              placeholder="1234"
              autoComplete="off"
              required
            />
          </div>
          {spidDigits && !isValidSpid && (
            <span className="text-xs text-red-500" role="alert">Enter at least 4 digits</span>
          )}
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1">
            <span className="text-sm text-zinc-600">Age</span>
            <input type="number" min={0} max={120} value={age} onChange={e=>setAge(Number(e.target.value))} className="border rounded px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-zinc-600">Gender</span>
            <select aria-label="Gender" value={gender} onChange={e=>setGender(e.target.value)} className="border rounded px-3 py-2">
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div className="grid gap-2">
          <span className="text-sm text-zinc-600">Select Symptoms</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search symptoms..."
              className="border rounded px-3 py-2 flex-1"
              aria-label="Search symptoms"
            />
            {filterQuery && (
              <button type="button" className="text-sm text-zinc-600 hover:underline" onClick={() => setFilterQuery('')}>
                Clear
              </button>
            )}
          </div>
          <SymptomHoneycomb
            symptoms={filteredSymptoms}
            selected={symptoms}
            onChange={setSymptoms}
            onAnnounce={setAnnouncement}
          />
          <SymptomLegend />
          {filterQuery && filteredSymptoms.length === 0 && (
            <div className="text-sm text-zinc-500">No symptoms match “{filterQuery}”.</div>
          )}
          <div className="sr-only" aria-live="polite">{announcement}</div>
        </div>

        {error && (
          <div className="text-red-500 text-sm" role="alert">{error}</div>
        )}

        <button 
          disabled={loading || !isValidSpid} 
          className="justify-self-start btn-primary px-4 py-2 rounded disabled:opacity-50 hover-lift"
        >
          {loading ? 'Evaluating…' : 'Evaluate Urgency'}
        </button>
      </form>

      {patientHistory.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Patient History</h3>
          <div className="grid gap-3">
            {patientHistory.map((record, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="font-medium">Remedy: {record.remedy}</div>
                <div className="text-sm text-zinc-600">
                  Symptoms: {Object.entries(record.symptoms).map(([name, score]) => `${name} (${score})`).join(', ')}
                </div>
                <div className="text-sm text-zinc-500">
                  Date: {new Date(record.createdAt).toLocaleDateString()}
                </div>
                {record.explanation && (
                  <div className="text-sm text-zinc-600 mt-1">
                    Explanation: {record.explanation}
                  </div>
                )}
                {record.notes && (
                  <div className="text-sm text-zinc-600 mt-1">
                    Notes: {record.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
