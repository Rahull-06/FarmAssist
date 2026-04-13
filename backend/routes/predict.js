import express from "express";
import { createPrediction } from "../controllers/predictController.js";

const router = express.Router();

router.post("/", createPrediction);

export default router;