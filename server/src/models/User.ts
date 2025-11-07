import { Schema, model } from 'mongoose';
const UserSchema = new Schema(
  {
    email: { type: String, unique: true, sparse: true },
    name: String
  },
  { timestamps: true }
);
export const User = model('User', UserSchema);
