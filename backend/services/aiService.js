/**
 * aiService.js — Powered by Google Gemini (Free tier, no credit card needed)
 * Get free API key at: https://aistudio.google.com
 * Add to .env: GEMINI_API_KEY=API_key_here
 */

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Fallback advice generator — rule-based, always works, no API needed.
 * Used when Gemini is rate-limited or unavailable.
 */
function generateFallbackAdvice({ district, soil, season, weather, crops, riskLevel }) {
    const topCrop = crops[0]?.name ?? "your selected crops";
    const temp    = weather.temperature;
    const humidity = weather.humidity;

    let weatherNote = "";
    if (temp > 37)        weatherNote = `With the current high temperature of ${temp}°C, heat stress is a concern — ensure adequate irrigation and consider mulching to retain soil moisture.`;
    else if (temp < 20)   weatherNote = `The current cool temperature of ${temp}°C is favorable for Rabi crops — monitor for frost risk during early morning hours.`;
    else                  weatherNote = `Current conditions of ${temp}°C and ${humidity}% humidity are ${humidity > 70 ? "moderately humid — watch for fungal diseases" : "suitable for field operations"}.`;

    let riskNote = "";
    if (riskLevel === "High")        riskNote = "Given the elevated risk level, prioritize drought-tolerant varieties and maintain strict irrigation schedules.";
    else if (riskLevel === "Medium") riskNote = "Moderate risk conditions require regular monitoring — scout fields every 3–4 days for pest and moisture stress signs.";
    else                             riskNote = "Favorable low-risk conditions are ideal for timely sowing and standard agronomic practices.";

    return `Based on current conditions in ${district}, ${topCrop} is your best bet for the ${season} season on ${soil} soil. ${weatherNote} ${riskNote} Ensure NPK fertilizer application at sowing stage and monitor market prices as the season progresses for optimal selling timing.`;
}

/**
 * Generate TRULY dynamic AI farming advice using Google Gemini.
 * Falls back to rule-based advice if Gemini is unavailable.
 */
export async function generateAIAdvice({ district, soil, season, land, weather, crops, riskLevel }) {
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key at all, use fallback immediately
    if (!apiKey) {
        console.warn("⚠️  No GEMINI_API_KEY — using fallback advice");
        return generateFallbackAdvice({ district, soil, season, weather, crops, riskLevel });
    }

    const prompt = `You are an expert agricultural advisor specializing in Telangana, India farming.

A farmer has submitted the following details for crop advisory:

FARM DETAILS:
- District: ${district}, Telangana
- Soil Type: ${soil}
- Cropping Season: ${season}
- Land Area: ${land} acres

LIVE WEATHER CONDITIONS (fetched right now from OpenWeatherMap):
- Temperature: ${weather.temperature}°C (Feels like: ${weather.feelsLike ?? weather.temperature}°C)
- Humidity: ${weather.humidity}%
- Rainfall: ${weather.rainfall}mm
- Wind Speed: ${weather.windSpeed ?? 0} km/h
- Condition: ${weather.condition}
- Cloud Cover: ${weather.cloudCover ?? "N/A"}%

RECOMMENDED CROPS (top matches for this soil + season combination):
${crops.map((c, i) => `${i + 1}. ${c.name} — Expected yield: ${c.yield}, Confidence: ${c.confidence}%`).join("\n")}

RISK LEVEL: ${riskLevel}

Based on ALL of this real data, write a detailed, practical farming advisory (3–5 sentences) that:
1. Addresses the CURRENT weather conditions specifically (mention actual temperature/humidity values)
2. Gives SPECIFIC advice for the top recommended crops in ${district}
3. Mentions any weather-based risks (heat stress, drought, flooding) based on the actual numbers
4. Gives one actionable step the farmer should take RIGHT NOW based on today's conditions
5. Mentions market or seasonal timing advice relevant to ${season} in Telangana

Write in a professional but farmer-friendly tone. Be specific, not generic. Do NOT use bullet points — write as flowing paragraphs. Max 150 words.`;

    // Auto-retry on rate limit — 4s delay, max 2 retries
    const callGemini = async (retries = 2) => {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.7,
                },
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            const status = response.status;

            if (status === 400) throw new Error(`invalid_request`);
            if (status === 403) throw new Error(`invalid_key`);

            if (status === 429) {
                if (retries > 0) {
                    console.log(`⏳ Gemini rate limit — retrying in 4s... (${retries} left)`);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    return callGemini(retries - 1);
                }
                throw new Error(`rate_limited`);
            }

            throw new Error(`api_error_${status}`);
        }

        const data = await response.json();
        const advice = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!advice) throw new Error("empty_response");
        return advice;
    };

    try {
        const advice = await callGemini();
        console.log(`✅ Gemini AI advice generated for ${district} (${season}, ${soil})`);
        return advice;

    } catch (error) {
        // ✅ FALLBACK — instead of crashing the whole request, return rule-based advice
        console.warn(`⚠️  Gemini unavailable (${error.message}) — using fallback advice for ${district}`);
        return generateFallbackAdvice({ district, soil, season, weather, crops, riskLevel });
    }
}

/**
 * Generate action items — weather-adjusted rule-based logic (no API call)
 */
export async function generateActionItems({ season, weather, crops, riskLevel }) {
    const items = [];

    if (weather.humidity < 50 || weather.temperature > 37) {
        items.push({ icon: "💧", title: "Irrigation", desc: `Critical — irrigate every 3 days (${weather.temperature}°C heat stress)` });
    } else if (weather.humidity < 65) {
        items.push({ icon: "💧", title: "Irrigation", desc: "Schedule weekly irrigation" });
    } else {
        items.push({ icon: "💧", title: "Irrigation", desc: "Moisture adequate — monitor weekly" });
    }

    items.push({ icon: "🌱", title: "Fertilizer", desc: "Apply NPK at sowing stage" });

    if (season.toLowerCase().includes("kharif")) {
        items.push({ icon: "🐛", title: "Pest Watch", desc: "Monitor whitefly & aphids from day 30" });
    } else if (season.toLowerCase().includes("rabi")) {
        items.push({ icon: "🐛", title: "Pest Watch", desc: "Watch for aphids in cooler weeks" });
    } else {
        items.push({ icon: "🐛", title: "Pest Watch", desc: "Check for leaf miners daily" });
    }

    return items;
}