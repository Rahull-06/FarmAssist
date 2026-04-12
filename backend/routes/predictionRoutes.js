const express = require("express");
const router = express.Router();
const validatePrediction = require("../middleware/validatePrediction");

const { getPrediction, getAllPredictions } = require("../controllers/predictionController");

router.post("/predict", getPrediction);
router.get("/predictions", getAllPredictions);
router.post("/predict", validatePrediction, getPrediction);

module.exports = router;