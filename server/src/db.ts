import mongoose from 'mongoose';
export async function connectDB(uri: string) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('✅ Mongo connected');
  } catch (error) {
    console.log('❌ Mongo not connected, continuing without DB');
  }
}
