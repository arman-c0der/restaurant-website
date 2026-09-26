import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
   "MONGODB_URI is not defined in .env"
  );
}

// Next.js hot-reload/serverless এ বারবার নতুন কানেকশন না খোলার জন্য cache করা হচ্ছে
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

 export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000, // fail fast instead of hanging
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // ⚠️ গুরুত্বপূর্ণ: fail হলে promise reset করে দিন
    throw e;
  }

  return cached.conn;
}
