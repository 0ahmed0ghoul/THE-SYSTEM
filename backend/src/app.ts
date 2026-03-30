import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";

export const app = express();

app.use(
	cors({
		origin: env.CLIENT_ORIGIN,
		credentials: true,
	}),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);

app.use(errorHandler);
