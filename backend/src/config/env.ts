import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "mysql://root:password@localhost:3306/workflow_db",
  JWT_SECRET: process.env.JWT_SECRET ?? "dev_secret_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
};
