import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { explanationService } from './explanationService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type TriageInput = {
  symptoms: Record<string, number>; // { symptom: severity }
  age: number;
  gender: string;
};

export type TriageOutput = {
  predicted: {
    UrgencyScore: number | null;
    UrgencyCategory: string | null;
    Remedy: string;
  };
  dosage: {
    Concentration: string | null;
    Dosage: string;
    Timing: string | null;
    'Age Category': string;
    Gender: string;
  };
  composition: {
    Remedy: string;
    Source: string;
    'Chemical Composition': string;
  };
  explanation?: string | null;
  fallbackUsed: boolean;
};

export async function scoreTriage(input: TriageInput): Promise<TriageOutput> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [join(__dirname, '../../pyservice/predict.py')], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Python process failed: ${errorOutput}`));
      } else {
        try {
          const result = JSON.parse(output);
          if (result.error) {
            reject(new Error(result.error));
          } else {
            // Generate explanation using AI (best-effort)
            let explanation: string | null = null;
            try {
              explanation = await explanationService.generateExplanation(
                input.symptoms,
                result.predicted?.UrgencyScore ?? 0,
                result.predicted?.UrgencyCategory ?? 'Unknown',
                result.predicted?.Remedy ?? '—',
                result.dosage
              );
            } catch {
              explanation = null;
            }

            // Add explanation to the result (optional field)
            resolve({
              ...result,
              explanation
            });
          }
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${output}`));
        }
      }
    });

    pythonProcess.stdin.write(JSON.stringify(input));
    pythonProcess.stdin.end();
  });
}
