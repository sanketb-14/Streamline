import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD);

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log("DB connection successful!");
    } catch (error) {
        console.log("DB connection error:", error);
    }
};

export default connectDB;