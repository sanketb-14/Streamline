// config/database.js
import mongoose from "mongoose";

let isConnected = false; // global flag

const connectDB = async () => {
  if (isConnected) {
    // Use existing database connection
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ DB connection successful!");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
