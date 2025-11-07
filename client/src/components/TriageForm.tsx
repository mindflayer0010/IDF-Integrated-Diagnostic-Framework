import React, { useState } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper, IconButton } from '@mui/material';
import { apiClient } from '../services/apiClient';

interface PredictionResponse {
  remedy: string;
  confidence?: number;
  explanation?: string;
}

interface PatientData {
  history: PatientHistory[];
}

interface TriageFormProps {
  onSubmit: (data: PredictionResponse) => void;
}

interface Symptom {
  name: string;
  urgencyScore: number;
}

interface PatientHistory {
  symptoms: Symptom[] | Record<string, number>;
  remedy: string;
  createdAt: string;
  notes?: string;
  explanation?: string;
}

export const TriageForm: React.FC<TriageFormProps> = ({ onSubmit }) => {
  const [spid, setSpid] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentUrgency, setCurrentUrgency] = useState<number>(1);
  const [isValidSpid, setIsValidSpid] = useState(false);
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
  const [error, setError] = useState('');

  const validateSpid = (value: string) => {
    const isValid = /^SPID\d{4}$/.test(value);
    setIsValidSpid(isValid);
    return isValid;
  };

  const fetchPatientHistory = async (patientSpid: string) => {
    const { data, error } = await apiClient.post<PatientData>('/patient', { spid: patientSpid });
    if (error) {
      setError(error);
      return;
    }
    setPatientHistory(data?.history || []);
    setError('');
  };

  const handleSpidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setSpid(value);
    if (validateSpid(value)) {
      fetchPatientHistory(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!isValidSpid) {
      setError('Please enter a valid SPID (SPID followed by 4 digits)');
      return;
    }

    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }
    
    const predictResponse = await apiClient.post<PredictionResponse>('/predict', { 
      spid,
      symptoms: symptoms 
    });

    if (predictResponse.error) {
      setError(predictResponse.error);
      return;
    }

    // Save triage log
    const triageResponse = await apiClient.post('/patient/triage', {
      spid,
      symptoms: symptoms,
      remedy: predictResponse.data?.remedy
    });

    if (triageResponse.error) {
      setError(triageResponse.error);
      return;
    }

    if (predictResponse.data) {
      onSubmit(predictResponse.data);
    }
    // Refresh patient history
    fetchPatientHistory(spid);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 3 }}>
      <TextField
        fullWidth
        label="Patient ID (SPID)"
        value={spid}
        onChange={handleSpidChange}
        error={spid !== '' && !isValidSpid}
        helperText={spid !== '' && !isValidSpid ? 'Invalid SPID format (must be SPID followed by 4 digits)' : ''}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Enter Symptoms and their Severity
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          For each symptom, specify its severity level from 1 (low) to 3 (high).
        </Typography>
        <TextField
          fullWidth
          label="Enter Symptom"
          placeholder="e.g., headache, fever, cough"
          value={currentSymptom}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentSymptom(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle2" gutterBottom>
          Select Symptom Severity:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <TextField
            select
            fullWidth
            label="Severity Level"
            value={currentUrgency}
            onChange={(e) => setCurrentUrgency(Number(e.target.value))}
            sx={{ minWidth: 150 }}
            helperText="1: Low | 2: Moderate | 3: High"
          >
            {[
              { value: 1, label: "1 - Low Severity" },
              { value: 2, label: "2 - Moderate Severity" },
              { value: 3, label: "3 - High Severity" }
            ].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (currentSymptom.trim()) {
              setSymptoms([...symptoms, { name: currentSymptom.trim(), urgencyScore: currentUrgency }]);
              setCurrentSymptom('');
            }
          }}
          sx={{ mt: 2 }}
        >
          Add This Symptom
        </Button>

        {symptoms.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Current Symptoms List
            </Typography>
            <List>
              {symptoms.map((symptom, index) => (
                <ListItem 
                  key={index}
                  divider
                  secondaryAction={
                    <IconButton edge="end" onClick={() => {
                      const newSymptoms = [...symptoms];
                      newSymptoms.splice(index, 1);
                      setSymptoms(newSymptoms);
                    }}>
                      <Typography color="error" sx={{ fontSize: '1.5rem' }}>×</Typography>
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1">
                        {symptom.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        Severity: {symptom.urgencyScore} - {
                          symptom.urgencyScore === 1 ? 'Low' :
                          symptom.urgencyScore === 2 ? 'Moderate' :
                          'High'
                        }
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!isValidSpid || symptoms.length === 0}
        >
          Submit
        </Button>

        {patientHistory.length > 0 && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Patient History
            </Typography>
            <List>
              {patientHistory.map((log, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Remedy: ${log.remedy}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Symptoms: {Array.isArray(log.symptoms)
                            ? log.symptoms.map(s => `${s.name} (Urgency: ${s.urgencyScore})`).join(', ')
                            : Object.entries(log.symptoms).map(([k,v]) => `${k} (${v})`).join(', ')}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Date: {new Date(log.createdAt).toLocaleDateString()}
                        </Typography>
                        {log.explanation && (
                          <>
                            <br />
                            <Typography component="span" variant="body2">
                              Explanation: {log.explanation}
                            </Typography>
                          </>
                        )}
                        {log.notes && (
                          <>
                            <br />
                            <Typography component="span" variant="body2">
                              Notes: {log.notes}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};