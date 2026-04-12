const asyncHandler = require("../utils/asyncHandler");
const Prediction = require("../models/Prediction");
const getWeather = require("../utils/weatherService");
const getBestCrop = require("../utils/predictionLogic");

const getPrediction = asyncHandler(async (req, res) => {
    const { region, soilType, season, acres } = req.body;

    if (!region || !soilType || !season || !acres) {
        res.status(400);
        throw new Error("Please provide all fields");
    }

    // ✅ Step 1: Get crop prediction from dataset
    const prediction = getBestCrop(soilType, season);

    let crop = prediction.crop;
    let risk = prediction.baseRisk;
    let advice = prediction.advice;

    // ✅ Step 2: Map region → city (for weather API)
    const cityMap = {
        "Telangana": "Hyderabad",
        "Andhra Pradesh": "Vijayawada",
        "Karnataka": "Bangalore"
    };

    const city = cityMap[region];

    // ✅ Step 3: Fetch weather
    const weather = await getWeather(city);

    // ✅ Step 4: Improve logic using weather
    if (weather.temperature > 35) {
        advice += " High temperature alert!";
        risk = "Medium";
    }

    if (weather.humidity > 80) {
        advice += " High humidity may affect crop health.";
        risk = "High";
    }

    // ✅ Step 5: Save to DB
    const savedData = await Prediction.create({
        region,
        soilType,
        season,
        acres,
        crop,
        risk,
        advice,
    });

    // ✅ Step 6: Send response (ONLY ONCE)
    res.json({
        success: true,
        data: {
            ...savedData._doc,
            weather,
        },
    });
});

const getAllPredictions = asyncHandler(async (req, res) => {
    const data = await Prediction.find().sort({ createdAt: -1 });

    res.json({
        success: true,
        count: data.length,
        data,
    });
});

module.exports = { getPrediction, getAllPredictions };