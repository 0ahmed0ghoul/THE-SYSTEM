import mysql from "mysql2/promise";
import { env } from "./env.js";

export const db = mysql.createPool(env.DATABASE_URL);
