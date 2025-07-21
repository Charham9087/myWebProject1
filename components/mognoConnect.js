import mongoose from 'mongoose';

export default async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // optional: extra options for stable connection
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return false;
  }
}


