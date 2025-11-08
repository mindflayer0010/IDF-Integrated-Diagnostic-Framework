import { useState, useEffect } from 'react';
import { postJSON, getJSON } from '../lib/api';

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
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState(0);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('M');
  const [loading, setLoading] = useState(false);
  const [symptomList, setSymptomList] = useState<string[]>([]);
  const [spidDigits, setSpidDigits] = useState('');
  const [isValidSpid, setIsValidSpid] = useState(false);
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
  const [error, setError] = useState('');

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
          <span className="text-sm text-zinc-600">Add Symptoms</span>
          
          <div className="flex gap-2">
            <select 
              value={currentSymptom} 
              onChange={e => setCurrentSymptom(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            >
              <option value="">Select a symptom...</option>
              {symptomList.map(symptom => (
                <option key={symptom} value={symptom} disabled={symptom in symptoms}>
                  {symptom}
                </option>
              ))}
            </select>
            
            <select 
              value={currentSeverity} 
              onChange={e => setCurrentSeverity(Number(e.target.value))}
              className="border rounded px-3 py-2 w-24"
              disabled={!currentSymptom}
            >
              <option value={0}>0 - None</option>
              <option value={1}>1 - Mild</option>
              <option value={2}>2 - Moderate</option>
              <option value={3}>3 - Severe</option>
            </select>

            <button
              type="button"
              onClick={() => {
                if (currentSymptom && currentSeverity > 0) {
                  setSymptoms(prev => ({
                    ...prev,
                    [currentSymptom]: currentSeverity
                  }));
                  setCurrentSymptom('');
                  setCurrentSeverity(0);
                }
              }}
              disabled={!currentSymptom || currentSeverity === 0}
              className="btn-primary px-3 py-2 rounded disabled:bg-opacity-50 hover-lift"
            >
              Add
            </button>
          </div>

          {Object.keys(symptoms).length > 0 && (
            <div className="mt-2 border rounded p-2">
              <div className="text-sm font-medium mb-2">Selected Symptoms:</div>
              <div className="grid gap-2">
                {Object.entries(symptoms).map(([symptom, severity]) => (
                  <div key={symptom} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{symptom}</span>
                    <span className="text-zinc-600">
                      Severity: {severity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSymptoms = { ...symptoms };
                        delete newSymptoms[symptom];
                        setSymptoms(newSymptoms);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
