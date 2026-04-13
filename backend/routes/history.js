import express from "express";
import {
    getHistory,
    getPredictionById,
    deletePrediction,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/",    getHistory);

router.get("/:id", getPredictionById);

router.delete("/:id", deletePrediction);

export default router;