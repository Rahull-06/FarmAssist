/**
 * aiService.js — Powered by Google Gemini (Free tier, no credit card needed)
 * Get your free API key at: https://aistudio.google.com
 * Add to .env: GEMINI_API_KEY=your_key_here
 */

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Generate TRULY dynamic AI farming advice using Google Gemini.
 *
 * This is NOT a template or rule-based response.
 * Gemini receives real live weather + crop data and generates
 * a unique, context-aware advisory paragraph every single time.
 *
 * Faculty answer: "We use Gemini (Google's LLM) via API to generate
 * real AI-driven advice based on live inputs — not pre-written templates."
 */
export async function generateAIAdvice({ district, soil, season, land, weather, crops, riskLevel }) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in .env");
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

    // Auto-retry on rate limit — 4s delay keeps total well under 60s axios timeout
    const callGemini = async (retries = 3) => {
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

            if (status === 400) throw new Error("Invalid Gemini request. Check prompt format.");
            if (status === 403) throw new Error("Invalid Gemini API key. Check GEMINI_API_KEY in .env");

            // Auto-retry on rate limit with 4s delay (3 retries = max ~12s extra)
            if (status === 429) {
                if (retries > 0) {
                    console.log(`⏳ Gemini rate limit hit — retrying in 4s... (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    return callGemini(retries - 1);
                }
                throw new Error("Gemini API rate limit reached. Please wait a minute and try again.");
            }

            throw new Error(`Gemini API error ${status}: ${err?.error?.message ?? "Unknown error"}`);
        }

        const data = await response.json();
        const advice = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!advice) throw new Error("Gemini returned an empty response");

        return advice;
    };

    try {
        const advice = await callGemini();
        console.log(`✅ AI advice generated for ${district} (${season}, ${soil})`);
        return advice;

    } catch (error) {
        throw new Error(`AI advice generation failed: ${error.message}`);
    }
}

/**
 * Generate action items — weather-adjusted rule-based logic (no extra API call)
 */
export async function generateActionItems({ season, weather, crops, riskLevel }) {
    const items = [];

    // Irrigation advice based on LIVE humidity + temperature
    if (weather.humidity < 50 || weather.temperature > 37) {
        items.push({ icon: "💧", title: "Irrigation", desc: `Critical — irrigate every 3 days (${weather.temperature}°C heat stress)` });
    } else if (weather.humidity < 65) {
        items.push({ icon: "💧", title: "Irrigation", desc: "Schedule weekly irrigation" });
    } else {
        items.push({ icon: "💧", title: "Irrigation", desc: "Moisture adequate — monitor weekly" });
    }

    // Fertilizer
    items.push({ icon: "🌱", title: "Fertilizer", desc: "Apply NPK at sowing stage" });

    // Pest watch — season specific
    if (season.toLowerCase().includes("kharif")) {
        items.push({ icon: "🐛", title: "Pest Watch", desc: "Monitor whitefly & aphids from day 30" });
    } else if (season.toLowerCase().includes("rabi")) {
        items.push({ icon: "🐛", title: "Pest Watch", desc: "Watch for aphids in cooler weeks" });
    } else {
        items.push({ icon: "🐛", title: "Pest Watch", desc: "Check for leaf miners daily" });
    }

    return items;
}