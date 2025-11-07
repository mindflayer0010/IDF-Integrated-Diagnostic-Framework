import 'dotenv/config';
export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/caremate',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  ALLOW_ORIGIN: process.env.ALLOW_ORIGIN || 'http://localhost:5173'
};
