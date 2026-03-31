import mysql from "mysql2/promise";
import { env } from "./env.js";

export const db = mysql.createPool(env.DATABASE_URL);

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