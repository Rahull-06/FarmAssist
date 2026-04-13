import { getLiveWeather } from "../services/weatherService.js";
import { getCropRecommendations, calculateRisk } from "../services/cropsService.js";
import { generateAIAdvice, generateActionItems } from "../services/aiService.js";
import Prediction from "../models/Prediction.js";

const RISK_DESCRIPTIONS = {
    Low:    "Favorable conditions detected based on live weather data. Minimal intervention required for a productive harvest season.",
    Medium: "Moderate risk factors present in current weather. Timely crop management and close monitoring is recommended.",
    High:   "Elevated risk detected — extreme temperature or moisture stress observed. Drought-tolerant varieties and careful irrigation management are critical.",
};

const RISK_FACTORS = {
    Low: [
        "Optimal temperature range for crop growth",
        "Adequate humidity levels detected",
        "Favorable seasonal conditions",
    ],
    Medium: [
        "Temperature slightly above optimal — monitor crops",
        "Irrigation scheduling recommended this week",
        "Watch for early signs of heat or moisture stress",
    ],
    High: [
        "Severe heat stress risk — temperature exceeds safe threshold",
        "Low humidity significantly reduces yield potential",
        "Immediate irrigation and shade management required",
    ],
};


export async function createPrediction(req, res) {
    try {
        const { district, soil, season, land } = req.body;

        if (!district || !soil || !season || !land) {
            return res.status(400).json({
                success: false,
                error: "All fields are required: district, soil, season, land",
            });
        }

        const landArea = parseFloat(land);
        if (isNaN(landArea) || landArea <= 0) {
            return res.status(400).json({
                success: false,
                error: "Land area must be a positive number",
            });
        }

        console.log(`\n📥 New prediction request: ${district} | ${soil} | ${season} | ${landArea} acres`);

        console.log("🌤️  Fetching live weather from OpenWeatherMap...");
        const weather = await getLiveWeather(district);

        console.log("🌾 Computing crop recommendations...");
        const crops = getCropRecommendations(season, soil, weather);

        const riskLevel = calculateRisk(weather, landArea);
        console.log(`⚠️  Risk level: ${riskLevel} (temp: ${weather.temperature}°C, humidity: ${weather.humidity}%)`);

        console.log("🤖 Generating AI advice via Claude...");
        const [aiAdvice, actionItems] = await Promise.all([
            generateAIAdvice({ district, soil, season, land: landArea, weather, crops, riskLevel }),
            generateActionItems({ season, weather, crops, riskLevel }),
        ]);

        console.log("💾 Saving prediction to MongoDB...");
        const prediction = new Prediction({
            district,
            soil,
            season,
            land:            landArea,
            crops,
            weather,
            riskLevel,
            riskDescription: RISK_DESCRIPTIONS[riskLevel],
            riskFactors:     RISK_FACTORS[riskLevel],
            aiAdvice,
            actionItems,
            confidence:      crops[0]?.confidence ?? 0,
        });

        const saved = await prediction.save();
        console.log(`✅ Saved to MongoDB with ID: ${saved._id}`);

        return res.status(201).json({
            success: true,
            data: {
                _id:             saved._id,
                district,
                soil,
                season,
                land:            landArea,
                crops,
                weather,
                riskLevel,
                riskDescription: RISK_DESCRIPTIONS[riskLevel],
                riskFactors:     RISK_FACTORS[riskLevel],
                aiAdvice,
                actionItems,
                createdAt:       saved.createdAt,
            },
        });

    } catch (error) {
        console.error("❌ Prediction error:", error.message);

        // Return specific error messages so frontend can display them
        return res.status(500).json({
            success: false,
            error:   error.message || "Prediction failed. Please try again.",
        });
    }
}