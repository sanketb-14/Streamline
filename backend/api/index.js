// api/index.js
import serverless from "serverless-http";
import app from "../app.js";
import connectDB from "../config/database.js";

// Ensure DB connection once (not inside handler)
await connectDB();

export default serverless(app);
