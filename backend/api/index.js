import serverless from "serverless-http";
import app from "../app.js";
import connectDB from "../config/database.js";

// Database connection - use connection pooling for serverless
let dbConnected = false;
let dbConnectionPromise = null;

async function ensureDbConnection() {
  if (!dbConnected) {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }
    await dbConnectionPromise;
    dbConnected = true;
  }
}

// Serverless handler with DB connection management
const handler = serverless(app);

export default async (req, res) => {
  try {
    // Ensure DB connection on cold start
    await ensureDbConnection();
    
    return handler(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
};