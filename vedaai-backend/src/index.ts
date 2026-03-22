import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db";
import { getRedisClient } from "./config/redis";
import { setupWebSocket } from "./socket/wsHandler";
import assignmentRoutes from "./routes/assignments";

const app = express();
const PORT = parseInt(process.env.PORT || "4000");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ── Rate Limiter ──────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requests per 15 min per IP
  message: { success: false, error: "Too many requests, slow down." }
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/assignments", limiter, assignmentRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
);

// ── HTTP + WebSocket server ───────────────────────────────────────────────────
const server = http.createServer(app);

const wss = new WebSocketServer({
  server,
  path: "/ws",
});

setupWebSocket(wss);

// ── Boot ──────────────────────────────────────────────────────────────────────
async function start(): Promise<void> {
  await connectDB();

  // Test Redis connection
  const redis = getRedisClient();
  await redis.connect();

  server.listen(PORT, () => {
    console.log(`\n🚀 VedaAI Backend running at http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server at ws://localhost:${PORT}/ws`);
    console.log(`📋 API: http://localhost:${PORT}/assignments\n`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down");
  server.close(() => process.exit(0));
});
