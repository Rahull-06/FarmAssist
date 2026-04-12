import { getLiveWeather } from "../services/weatherService.js";
import { getCropRecommendations, calculateRisk } from "../services/cropsService.js";
import { generateAIAdvice, generateActionItems } from "../services/aiService.js";
import Prediction from "../models/Prediction.js";

// ── Risk descriptions (used to explain risk level to farmer) ─────────────────
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

/**
 * POST /api/predict
 *
 * Main prediction endpoint:
 * 1. Validates input
 * 2. Fetches LIVE weather from OpenWeatherMap
 * 3. Gets crop recommendations (weather-adjusted)
 * 4. Calculates risk level from live data
 * 5. Generates REAL AI advice via Claude
 * 6. Saves everything to MongoDB
 * 7. Returns full result to frontend
 */
export async function createPrediction(req, res) {
    try {
        const { district, soil, season, land } = req.body;

        // ── Input validation ──────────────────────────────────────────────────
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

        // ── Step 1: Fetch LIVE weather ─────────────────────────────────────────
        console.log("🌤️  Fetching live weather from OpenWeatherMap...");
        const weather = await getLiveWeather(district);

        // ── Step 2: Get crop recommendations (weather-adjusted) ────────────────
        console.log("🌾 Computing crop recommendations...");
        const crops = getCropRecommendations(season, soil, weather);

        // ── Step 3: Calculate risk from live weather ───────────────────────────
        const riskLevel = calculateRisk(weather, landArea);
        console.log(`⚠️  Risk level: ${riskLevel} (temp: ${weather.temperature}°C, humidity: ${weather.humidity}%)`);

        // ── Step 4: Generate REAL AI advice via Claude ─────────────────────────
        console.log("🤖 Generating AI advice via Claude...");
        const [aiAdvice, actionItems] = await Promise.all([
            generateAIAdvice({ district, soil, season, land: landArea, weather, crops, riskLevel }),
            generateActionItems({ season, weather, crops, riskLevel }),
        ]);

        // ── Step 5: Save to MongoDB ────────────────────────────────────────────
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

        // ── Step 6: Return result ─────────────────────────────────────────────
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