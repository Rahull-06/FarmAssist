// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import predictRoutes from "./routes/predict.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
// const corsOptions = {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// };


const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("❌ Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/predict", predictRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
    res.send("FarmAssist API is running 🚀");
});

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

// Create HTTP server separately so we can close it cleanly
const server = createServer(app);

// ── Graceful Shutdown (prevents EADDRINUSE on next restart) ─────────────────
function gracefulShutdown(signal) {
    console.log(`\n⚠️  ${signal} received — shutting down gracefully...`);
    server.close(() => {
        console.log("✅ HTTP server closed");
        mongoose.connection.close(false).then(() => {
            console.log("✅ MongoDB connection closed");
            process.exit(0);
        });
    });

    // Force-exit if it takes more than 5 seconds
    setTimeout(() => {
        console.error("❌ Forced shutdown after timeout");
        process.exit(1);
    }, 5000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));   // Ctrl+C

// ── Handle EADDRINUSE cleanly instead of crashing ───────────────────────────
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error(`👉 Run this command to fix it, then restart:\n`);
        console.error(`   For Windows (CMD / PowerShell):`);
        console.error(`   netstat -ano | findstr :${PORT}`);
        console.error(`   taskkill /PID <PID_NUMBER> /F\n`);
        console.error(`   For Mac/Linux:`);
        console.error(`   lsof -ti :${PORT} | xargs kill -9\n`);
        process.exit(1);
    } else {
        throw err;
    }
});

// ── Connect to MongoDB then start server ─────────────────────────────────────
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        server.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });