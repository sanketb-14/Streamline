// api/index.js
import serverless from "serverless-http";
import app from "../app.js";
import connectDB from "../config/database.js";

let dbPromise;

async function handler(req, res) {
  if (!dbPromise) {
    dbPromise = connectDB();
  }
  await dbPromise;

  const wrapped = serverless(app);
  return wrapped(req, res);
}

export default handler;
