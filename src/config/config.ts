import dotenv from 'dotenv';
import path from 'path';

const dirPath = path.join(__dirname, "../../env");
const envFilePath = path.resolve(dirPath, `${process.env.NODE_ENV}.env`);
dotenv.config({
    path: path.resolve(envFilePath)
});

const MONGO_URI = process.env.MONGO_URL || "";
const APP_PORT = Number(process.env.SERVER_PORT) || 4000;
const MAX_UPLOAD_LIMIT = process.env.MAX_UPLOAD_LIMIT;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

export {
    MONGO_URI, APP_PORT, MAX_UPLOAD_LIMIT, GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET, REDIRECT_URL, JWT_SECRET, SESSION_SECRET
}