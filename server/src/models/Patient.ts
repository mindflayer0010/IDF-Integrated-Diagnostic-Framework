import { Schema, model } from 'mongoose';

interface IPatient {
    spid: string;
    triageLogs: Schema.Types.ObjectId[];
    createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
    spid: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: (v: string) => /^SPID\d{4,}$/.test(v),
            message: props => `${props.value} is not a valid SPID format! Must be SPID followed by at least 4 digits.`
        }
    },
    triageLogs: [{ type: Schema.Types.ObjectId, ref: 'TriageLog' }],
    createdAt: { type: Date, default: Date.now }
});

export const Patient = model('Patient', PatientSchema);