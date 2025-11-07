import { Schema, model, Types } from 'mongoose';

const TriageLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    // Link to patient by SPID for history queries
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    // Redundant but practical: store SPID for easy querying and visibility in collections
    spid: { type: String, index: true },
    // Store symptoms as a flexible map of { [name]: severity } for compatibility
    // Older logs might store an array; controllers will normalize on read.
    symptoms: { type: Schema.Types.Mixed },
    age: Number,
    gender: String,
    ageCategory: String,
    // Convenience top-level field for quick listing in history
    remedy: String,
    predicted: {
      UrgencyScore: Number,
      UrgencyCategory: String,
      Remedy: String
    },
    dosage: {
      Concentration: String,
      Dosage: String,
      Timing: String,
      'Age Category': String,
      Gender: String
    },
    composition: {
      Remedy: String,
      Source: String,
      'Chemical Composition': String
    },
    fallbackUsed: Boolean,
    notes: String,
    emotion: String,
    explanation: String // AI-generated patient-friendly explanation
  },
  { timestamps: true }
);

export const TriageLog = model('TriageLog', TriageLogSchema);
