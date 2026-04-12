import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import predictRoutes from "./routes/predict.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/predict", predictRoutes);
app.use("/api/history", historyRoutes);

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "FarmAssist API is running",
        timestamp: new Date().toISOString(),
    });
});

// ── MongoDB Connection + Server Start ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });