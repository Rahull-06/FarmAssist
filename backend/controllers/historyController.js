import Prediction from "../models/Prediction.js";

/**
 * GET /api/history
 * Returns all past predictions from MongoDB (newest first)
 * This powers the Dashboard page with REAL stored data
 */
export async function getHistory(req, res) {
    try {
        const { limit = 20, district, season } = req.query;

        const filter = {};
        if (district) filter.district = new RegExp(district, "i");
        if (season)   filter.season   = new RegExp(season,   "i");

        const predictions = await Prediction.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select("-__v")
            .lean();
        return res.status(200).json({
            success: true,
            count:   predictions.length,
            data:    predictions,
        });

    } catch (error) {
        console.error("❌ History fetch error:", error.message);
        return res.status(500).json({
            success: false,
            error:   "Failed to fetch prediction history",
        });
    }
}

/**
 * GET /api/history/:id
 * Get a single prediction by MongoDB _id
 */
export async function getPredictionById(req, res) {
    try {
        const prediction = await Prediction.findById(req.params.id).lean();

        if (!prediction) {
            return res.status(404).json({
                success: false,
                error: "Prediction not found",
            });
        }

        return res.status(200).json({ success: true, data: prediction });

    } catch (error) {
        console.error("❌ Fetch by ID error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch prediction",
        });
    }
}

/**
 * DELETE /api/history/:id
 * Delete a prediction from MongoDB
 */
export async function deletePrediction(req, res) {
    try {
        const deleted = await Prediction.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, error: "Prediction not found" });
        }

        return res.status(200).json({ success: true, message: "Prediction deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Delete failed" });
    }
}