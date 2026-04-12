import mongoose from "mongoose";

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const CropSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    emoji:      { type: String, default: "🌾" },
    yield:      { type: String },           // e.g. "5.2–6.8 t/ha"
    confidence: { type: Number, min: 0, max: 100 },
}, { _id: false });

const WeatherSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },   // °C
    humidity:    { type: Number, required: true },   // %
    rainfall:    { type: Number, default: 0 },       // mm
    condition:   { type: String, required: true },   // "Sunny", "Cloudy" etc.
    windSpeed:   { type: Number, default: 0 },       // km/h
    feelsLike:   { type: Number },                   // °C
    source:      { type: String, default: "OpenWeatherMap" },
    fetchedAt:   { type: Date, default: Date.now },
}, { _id: false });

const ActionItemSchema = new mongoose.Schema({
    icon:  { type: String },
    title: { type: String },
    desc:  { type: String },
}, { _id: false });

// ── Main Prediction Schema ───────────────────────────────────────────────────

const PredictionSchema = new mongoose.Schema(
    {
        // Input fields (what the user entered)
        district: { type: String, required: true, trim: true },
        soil:     { type: String, required: true, trim: true },
        season:   { type: String, required: true, trim: true },
        land:     { type: Number, required: true, min: 0.1 },

        // Results
        crops:           { type: [CropSchema], required: true },
        weather:         { type: WeatherSchema, required: true },
        riskLevel:       { type: String, enum: ["Low", "Medium", "High"], required: true },
        riskDescription: { type: String },
        riskFactors:     { type: [String], default: [] },

        // AI-generated advice (from Claude API — truly dynamic)
        aiAdvice:    { type: String, required: true },
        actionItems: { type: [ActionItemSchema], default: [] },

        // Metadata
        confidence:  { type: Number, default: 0 },   // top crop confidence score
    },
    {
        timestamps: true,   // adds createdAt + updatedAt automatically
    }
);

// Index for faster dashboard queries (sort by newest)
PredictionSchema.index({ createdAt: -1 });
PredictionSchema.index({ district: 1 });

export default mongoose.model("Prediction", PredictionSchema);