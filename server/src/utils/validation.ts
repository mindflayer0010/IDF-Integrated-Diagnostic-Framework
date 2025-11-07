import { z } from 'zod';
export const triageSchema = z.object({
  symptoms: z.record(z.string(), z.number().int().min(0).max(3)),
  // Accept either 'SPID1234' or digits-only '1234' and normalize server-side
  spid: z.string().regex(/^(SPID\d{4,}|\d{4,})$/i),
  age: z.number().int().min(1).max(120),
  gender: z.string().regex(/^(M|F|Other)$/i),
  notes: z.string().optional(),
  emotion: z.string().optional()
});
export type TriageSchema = z.infer<typeof triageSchema>;
