import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { PrismaClient } from "@fixit/db";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      userCount: userCount,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Clerk middleware for protected routes only
app.use(clerkMiddleware());

// Protected endpoints
app.post("/api/retrieve", requireAuth(), (req, res) => {
  res.json({ message: "retrieve endpoint - coming soon" });
});

app.post("/api/fsrs/review", requireAuth(), (req, res) => {
  res.json({ message: "fsrs endpoint - coming soon" });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
