import express from "express";
import {
    getHistory,
    getPredictionById,
    deletePrediction,
} from "../controllers/historyController.js";

const router = express.Router();

// GET  /api/history          — all predictions (Dashboard)
router.get("/",    getHistory);

// GET  /api/history/:id      — single prediction
router.get("/:id", getPredictionById);

// DELETE /api/history/:id    — delete one
router.delete("/:id", deletePrediction);

export default router;