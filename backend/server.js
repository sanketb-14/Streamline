// server.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST, before any other imports
dotenv.config({ path: path.join(__dirname, 'config.env') });

// Now import the rest of the application
import app from "./app.js";
import connectDB from "./config/database.js";



connectDB();

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.timeout = 300000