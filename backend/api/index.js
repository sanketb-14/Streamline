import serverless from "serverless-http";
import app from "../app.js";
import connectDB from "../config/database.js";

// ensure DB connects only once
let isConnected = false;

async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  const wrapped = serverless(app);
  return wrapped(req, res);
}

export default handler;
