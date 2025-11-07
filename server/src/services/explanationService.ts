import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { env } from '../env';

export class ExplanationService {
  private gemini: GoogleGenerativeAI | null;
  private openai: OpenAI | null;

  constructor() {
    this.gemini = env.GEMINI_API_KEY ? new GoogleGenerativeAI(String(env.GEMINI_API_KEY)) : null;
    this.openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: String(env.OPENAI_API_KEY) }) : null;
  }

  async generateExplanation(
    symptoms: Record<string, number>,
    urgencyScore: number,
    urgencyCategory: string,
    remedy: string,
    dosage: any
  ): Promise<string> {
    const prompt = this.createPrompt(symptoms, urgencyScore, urgencyCategory, remedy, dosage);
    // Try Gemini first if configured
    if (this.gemini) {
      try {
        return await this.generateWithGemini(prompt);
      } catch (error) {
        console.warn('Gemini API failed, falling back to OpenAI:', error);
      }
    }
    // Fallback to OpenAI if configured
    if (this.openai) {
      try {
        return await this.generateWithOpenAI(prompt);
      } catch (error) {
        console.warn('OpenAI API failed:', error);
      }
    }
    // Final safe fallback (no keys or both failed)
    return this.simpleFallback(symptoms, urgencyScore, urgencyCategory, remedy, dosage);
  }

  private async generateWithGemini(prompt: string): Promise<string> {
    if (!this.gemini) throw new Error('Gemini not configured');
    const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text?.trim() || 'No explanation available';
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not configured');
  const model = env.OPENAI_MODEL || 'gpt-4o-mini';
    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });
    return response.choices?.[0]?.message?.content?.trim() || 'No explanation available';
  }

  private createPrompt(
    symptoms: Record<string, number>,
    urgencyScore: number,
    urgencyCategory: string,
    remedy: string,
    dosage: any
  ): string {
    const symptomsList = Object.entries(symptoms)
      .map(([symptom, severity]) => `${symptom} (severity: ${severity})`)
      .join(', ');

    return `Please provide a patient-friendly explanation of their medical assessment in a compassionate and clear way. Include:

1. A summary of their symptoms: ${symptomsList}
2. The urgency assessment (${urgencyCategory}, score: ${urgencyScore}/10)
3. The recommended remedy (${remedy})
4. Dosage instructions: ${JSON.stringify(dosage)}

Keep the explanation concise, empathetic, and easy to understand. Avoid medical jargon where possible.`;
  }

  private simpleFallback(
    symptoms: Record<string, number>,
    urgencyScore: number,
    urgencyCategory: string,
    remedy: string,
    dosage: any
  ): string {
    const top = Object.entries(symptoms)
      .filter(([_, v]) => (v ?? 0) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([k, v]) => `${k}(${v})`) 
      .join(', ');
    return `Based on your symptoms (${top || 'reported'}), your current urgency looks ${urgencyCategory} (score ${urgencyScore}/10). The suggested remedy is ${remedy}. Please follow the dosage: ${dosage?.Dosage ?? 'as directed'}. If your symptoms worsen (e.g., severe pain, confusion, trouble breathing), seek immediate medical help.`;
  }
}

export const explanationService = new ExplanationService();