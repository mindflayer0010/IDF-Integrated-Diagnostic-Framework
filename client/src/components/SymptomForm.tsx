import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Calendar, Activity, AlertCircle, X, ChevronRight } from 'lucide-react';
import { postJSON, getJSON } from '../lib/api';
import SymptomHoneycomb from './SymptomHoneycomb';
import { cn } from '../lib/utils';

type Result = { predicted: { UrgencyScore: number | null; UrgencyCategory: string | null; Remedy: string }; dosage: { Concentration: string | null; Dosage: string; Timing: string | null; 'Age Category': string; Gender: string }; composition: { Remedy: string; Source: string; 'Chemical Composition': string }; explanation: string; fallbackUsed: boolean; logId: string | null };

interface PatientHistory {
  symptoms: Record<string, number>;
  remedy: string;
  createdAt: string;
  notes?: string;
  explanation?: string;
}

export default function SymptomForm({ onResult, onLoading }: { onResult: (r: Result) => void; onLoading?: (loading: boolean) => void }) {
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidSpid) {
      setError('Please enter a valid SPID (SPID followed by 4 digits)');
      return;
    }

    setLoading(true);
    if (onLoading) onLoading(true);
    try {
      const payload = { spid: `SPID${spidDigits}`, symptoms, age, gender };
      const data = await postJSON('/api/triage', payload);
      onResult(data);
      await fetchPatientHistory(`SPID${spidDigits}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit triage data');
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  }

  const filteredSymptoms = filterQuery
    ? symptomList.filter((s) => s.toLowerCase().includes(filterQuery.toLowerCase()))
    : symptomList;

  return (
    <div className="grid gap-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 grid gap-6"
        noValidate
      >
        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Patient ID</span>
            <div className={cn(
              "flex items-center rounded-lg border bg-white/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all",
              !spidDigits || isValidSpid ? "border-slate-200" : "border-red-300 ring-2 ring-red-100"
            )}>
              <div className="pl-3 pr-2 py-2 text-slate-400 border-r border-slate-200 select-none font-mono text-sm">SPID</div>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{4,}"
                value={spidDigits}
                onChange={e => handleSpidDigitsChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent outline-none font-mono text-slate-900 placeholder:text-slate-400"
                placeholder="1234"
                autoComplete="off"
              />
            </div>
            {spidDigits && !isValidSpid && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Enter at least 4 digits
              </span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Age</span>
            <input
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="input-field"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Gender</span>
            <div className="relative">
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="input-field appearance-none"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Select Symptoms</span>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search symptoms..."
                className="input-field !pl-10 py-2 text-sm"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl border border-slate-200/50 p-4 min-h-[300px]">
            <SymptomHoneycomb
              symptoms={filteredSymptoms}
              selected={symptoms}
              onChange={setSymptoms}
              onAnnounce={setAnnouncement}
            />
            {filterQuery && filteredSymptoms.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No symptoms match "{filterQuery}"
              </div>
            )}
          </div>
          <div className="sr-only" aria-live="polite">{announcement}</div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            disabled={loading || !isValidSpid}
            className="btn-primary min-w-[160px] group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin" />
                Evaluating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Evaluate Urgency
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </button>
        </div>
      </motion.form>

      {patientHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-primary" />
            Patient History
          </h3>
          <div className="space-y-4">
            {patientHistory.map((record, index) => (
              <div key={index} className="group relative pl-6 border-l-2 border-slate-200 hover:border-brand-primary transition-colors pb-6 last:pb-0">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border-2 border-slate-300 group-hover:border-brand-primary transition-colors" />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                  <span className="font-medium text-slate-900">{record.remedy}</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-sm text-slate-600 mb-2">
                  <span className="font-medium text-slate-700">Symptoms: </span>
                  {Object.entries(record.symptoms).map(([name, score]) => (
                    <span key={name} className="inline-flex items-center gap-1 mr-3">
                      {name}
                      <span className={cn(
                        "text-[10px] px-1.5 rounded-full font-medium",
                        score === 1 ? "bg-slate-100 text-slate-600" :
                          score === 2 ? "bg-sky-100 text-sky-700" :
                            "bg-emerald-100 text-emerald-700"
                      )}>
                        {score}
                      </span>
                    </span>
                  ))}
                </div>

                {record.explanation && (
                  <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {record.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
