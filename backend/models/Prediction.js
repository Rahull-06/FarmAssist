const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
    {
        region: String,
        soilType: String,
        season: String,
        acres: Number,

        crop: String,
        risk: String,
        advice: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Prediction", predictionSchema);