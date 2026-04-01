import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import debugRoutes from "./routes/debug.routes.js";
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
app.use('/api/debug', debugRoutes); // Add debug routes

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(errorHandler);
