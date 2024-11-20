import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 6666;
export const HOST = process.env.HOST || '127.0.0.1';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB1_NAME = process.env.DB1_NAME || 'user_db';
export const DB1_USER = process.env.DB1_USER || 'root';
export const DB1_PASSWORD = process.env.DB1_PASSWORD || 'qwe123';
export const DB1_HOST = process.env.DB1_HOST || 'localhost';
export const DB1_PORT = process.env.DB1_PORT || 8886;

export const DB2_NAME = process.env.DB2_NAME || 'game_db';
export const DB2_USER = process.env.DB2_USER || 'root';
export const DB2_PASSWORD = process.env.DB2_PASSWORD || 'qwe123';
export const DB2_HOST = process.env.DB2_HOST || 'localhost';
export const DB2_PORT = process.env.DB2_PORT || 8886;

export const JWT_SECRET = process.env.JWT_SECRET || 'test6666';
