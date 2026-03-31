import mysql from "mysql2/promise";
import { env } from "./env.js";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'the system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully");

    connection.release(); // important
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Database connection failed:", error.message);
    } else {
      console.error("❌ Database connection failed:", error);
    }
  }
})();