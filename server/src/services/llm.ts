// Deprecated: Explanations are generated via ExplanationService (Gemini/OpenAI) in triageEngine
export async function explainLikeDoctor(symptoms: string[], urgency: number, emotion?: string) {
  const list = symptoms.join(', ');
  return `Based on reported symptoms (${list}), the estimated urgency is ${urgency}/10. Monitor for warning signs and seek care if worsening.`;
}
