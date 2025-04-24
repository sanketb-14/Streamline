// config/config.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

// Verify environment variables are loaded
if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    console.error('Missing required OAuth credentials in environment variables');
    process.exit(1);
}

export const config = {
    port: process.env.PORT || 4000,
    database: process.env.DATABASE,
    jwtSecret: process.env.JWT_SECRET,
    oauthClientId: process.env.OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV
};