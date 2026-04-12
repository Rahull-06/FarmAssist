import express from "express";
import { createPrediction } from "../controllers/predictController.js";

const router = express.Router();

// POST /api/predict
router.post("/", createPrediction);

export default router;