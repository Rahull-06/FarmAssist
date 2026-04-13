// ── Crop Database ─────────────────────────────────────────────────────────────
// Agronomically accurate crop recommendations for Telangana
// Based on: ICAR guidelines + Telangana State Agriculture Department data

const CROP_DB = {
    "kharif (rainy)": {
        loamy: [
            { name: "Rice (Sona Masuri)",  emoji: "🌾", yield: "5.2–6.8 t/ha", confidence: 94 },
            { name: "Cotton (Bt Hybrid)",  emoji: "🌿", yield: "2.5–3.2 t/ha", confidence: 88 },
            { name: "Maize (DHM-117)",     emoji: "🌽", yield: "6.5–8.0 t/ha", confidence: 82 },
            { name: "Soybean",             emoji: "🫘", yield: "1.8–2.4 t/ha", confidence: 76 },
        ],
        clay: [
            { name: "Rice (MTU-1010)",     emoji: "🌾", yield: "5.8–7.2 t/ha", confidence: 96 },
            { name: "Sugarcane",           emoji: "🎋", yield: "80–100 t/ha",  confidence: 85 },
            { name: "Cotton (NCS-145)",    emoji: "🌿", yield: "2.2–3.0 t/ha", confidence: 79 },
            { name: "Tur Dal (Pigeonpea)", emoji: "🫘", yield: "1.2–1.8 t/ha", confidence: 72 },
        ],
        sandy: [
            { name: "Groundnut (K-6)",    emoji: "🥜", yield: "2.0–2.8 t/ha", confidence: 91 },
            { name: "Pearl Millet",       emoji: "🌾", yield: "2.5–3.5 t/ha", confidence: 84 },
            { name: "Sesame",             emoji: "🌱", yield: "0.6–1.0 t/ha", confidence: 77 },
            { name: "Castor",             emoji: "🌿", yield: "1.5–2.2 t/ha", confidence: 70 },
        ],
        black: [
            { name: "Cotton (Bt Hybrid)", emoji: "🌿", yield: "3.0–4.0 t/ha", confidence: 97 },
            { name: "Soybean",            emoji: "🫘", yield: "2.0–2.8 t/ha", confidence: 88 },
            { name: "Tur Dal",            emoji: "🫘", yield: "1.5–2.0 t/ha", confidence: 81 },
            { name: "Rice (BPT-5204)",    emoji: "🌾", yield: "5.0–6.5 t/ha", confidence: 74 },
        ],
        red: [
            { name: "Groundnut (TMV-2)",   emoji: "🥜", yield: "1.8–2.5 t/ha", confidence: 92 },
            { name: "Pearl Millet (HHB)",  emoji: "🌾", yield: "2.0–3.0 t/ha", confidence: 85 },
            { name: "Foxtail Millet",      emoji: "🌾", yield: "1.5–2.2 t/ha", confidence: 78 },
            { name: "Castor",              emoji: "🌿", yield: "1.2–1.8 t/ha", confidence: 70 },
        ],
        alluvial: [
            { name: "Rice (Swarna MTU)",  emoji: "🌾", yield: "6.0–7.5 t/ha", confidence: 95 },
            { name: "Banana",             emoji: "🍌", yield: "30–40 t/ha",   confidence: 88 },
            { name: "Sugarcane",          emoji: "🎋", yield: "90–110 t/ha",  confidence: 82 },
            { name: "Maize (DHM-117)",    emoji: "🌽", yield: "7.0–9.0 t/ha", confidence: 75 },
        ],
    },
    "rabi (winter)": {
        loamy: [
            { name: "Wheat (GW-322)",     emoji: "🌾", yield: "4.0–5.5 t/ha", confidence: 92 },
            { name: "Chickpea (JG-11)",   emoji: "🫘", yield: "1.5–2.2 t/ha", confidence: 86 },
            { name: "Sunflower",          emoji: "🌻", yield: "1.8–2.5 t/ha", confidence: 81 },
            { name: "Sorghum (Rabi)",     emoji: "🌾", yield: "2.8–3.5 t/ha", confidence: 74 },
        ],
        clay: [
            { name: "Sorghum (CSH-16R)", emoji: "🌾", yield: "3.2–4.0 t/ha", confidence: 93 },
            { name: "Wheat (HI-8498)",   emoji: "🌾", yield: "4.5–6.0 t/ha", confidence: 89 },
            { name: "Safflower",         emoji: "🌸", yield: "1.2–1.8 t/ha", confidence: 78 },
            { name: "Linseed",           emoji: "🌿", yield: "0.8–1.2 t/ha", confidence: 68 },
        ],
        sandy: [
            { name: "Mustard (Pusa Bold)",  emoji: "🌱", yield: "1.4–2.0 t/ha", confidence: 88 },
            { name: "Chickpea (Annigeri)", emoji: "🫘", yield: "1.2–1.8 t/ha", confidence: 83 },
            { name: "Barley",              emoji: "🌾", yield: "2.5–3.2 t/ha", confidence: 75 },
            { name: "Coriander",           emoji: "🌿", yield: "0.8–1.4 t/ha", confidence: 69 },
        ],
        black: [
            { name: "Sorghum (M-35-1)",  emoji: "🌾", yield: "3.5–4.5 t/ha", confidence: 94 },
            { name: "Chickpea (Vijay)",  emoji: "🫘", yield: "1.5–2.0 t/ha", confidence: 87 },
            { name: "Safflower",         emoji: "🌸", yield: "1.4–2.0 t/ha", confidence: 79 },
            { name: "Wheat (HD-2781)",   emoji: "🌾", yield: "4.0–5.2 t/ha", confidence: 72 },
        ],
        red: [
            { name: "Mustard (Varuna)",     emoji: "🌱", yield: "1.2–1.8 t/ha", confidence: 86 },
            { name: "Chickpea (L-550)",     emoji: "🫘", yield: "1.0–1.5 t/ha", confidence: 80 },
            { name: "Linseed",              emoji: "🌿", yield: "0.7–1.1 t/ha", confidence: 72 },
            { name: "Coriander (Rajendra)", emoji: "🌿", yield: "0.8–1.3 t/ha", confidence: 65 },
        ],
        alluvial: [
            { name: "Wheat (PBW-343)",     emoji: "🌾", yield: "5.0–6.5 t/ha", confidence: 93 },
            { name: "Mustard (Pusa Teja)", emoji: "🌱", yield: "1.8–2.5 t/ha", confidence: 86 },
            { name: "Potato",              emoji: "🥔", yield: "20–28 t/ha",   confidence: 80 },
            { name: "Chickpea (JG-63)",    emoji: "🫘", yield: "1.8–2.3 t/ha", confidence: 73 },
        ],
    },
    "zaid (summer)": {
        loamy: [
            { name: "Watermelon",     emoji: "🍉", yield: "25–35 t/ha", confidence: 90 },
            { name: "Cucumber",       emoji: "🥒", yield: "15–20 t/ha", confidence: 85 },
            { name: "Maize (Fodder)", emoji: "🌽", yield: "40–50 t/ha", confidence: 80 },
            { name: "Bottle Gourd",   emoji: "🥬", yield: "18–25 t/ha", confidence: 73 },
        ],
        clay: [
            { name: "Mung Bean",            emoji: "🫘", yield: "0.8–1.2 t/ha", confidence: 87 },
            { name: "Cowpea",               emoji: "🫘", yield: "1.0–1.5 t/ha", confidence: 82 },
            { name: "Groundnut (Summer)",   emoji: "🥜", yield: "1.8–2.5 t/ha", confidence: 77 },
            { name: "Bitter Gourd",         emoji: "🥬", yield: "12–18 t/ha",   confidence: 70 },
        ],
        sandy: [
            { name: "Sesame (Summer)", emoji: "🌱", yield: "0.5–0.8 t/ha", confidence: 85 },
            { name: "Mung Bean",       emoji: "🫘", yield: "0.7–1.0 t/ha", confidence: 80 },
            { name: "Moth Bean",       emoji: "🫘", yield: "0.5–0.9 t/ha", confidence: 74 },
            { name: "Cluster Bean",    emoji: "🌿", yield: "1.2–1.8 t/ha", confidence: 67 },
        ],
        black: [
            { name: "Cowpea (Pusa Komal)",  emoji: "🫘", yield: "1.2–1.8 t/ha", confidence: 88 },
            { name: "Mung Bean (SML-668)",  emoji: "🫘", yield: "0.9–1.3 t/ha", confidence: 82 },
            { name: "Bitter Gourd",         emoji: "🥬", yield: "14–20 t/ha",   confidence: 75 },
            { name: "Ridge Gourd",          emoji: "🥬", yield: "12–16 t/ha",   confidence: 68 },
        ],
        red: [
            { name: "Sesame (RT-346)",       emoji: "🌱", yield: "0.6–0.9 t/ha", confidence: 86 },
            { name: "Cluster Bean (HG-75)", emoji: "🌿", yield: "1.0–1.5 t/ha", confidence: 79 },
            { name: "Moth Bean",             emoji: "🫘", yield: "0.5–0.8 t/ha", confidence: 72 },
            { name: "Cowpea",                emoji: "🫘", yield: "0.8–1.2 t/ha", confidence: 65 },
        ],
        alluvial: [
            { name: "Watermelon (Sugar Baby)", emoji: "🍉", yield: "30–40 t/ha", confidence: 92 },
            { name: "Muskmelon",               emoji: "🍈", yield: "18–25 t/ha", confidence: 86 },
            { name: "Cucumber (Poinsett)",     emoji: "🥒", yield: "18–24 t/ha", confidence: 80 },
            { name: "Okra (Parbhani Kranti)",  emoji: "🌿", yield: "10–15 t/ha", confidence: 73 },
        ],
    },
};


export function normalizeSoilKey(soil) {
    const s = soil.toLowerCase();
    if (s.includes("black"))    return "black";
    if (s.includes("red"))      return "red";
    if (s.includes("alluvial")) return "alluvial";
    if (s.includes("clay"))     return "clay";
    if (s.includes("sandy"))    return "sandy";
    return "loamy";
}

export function getCropRecommendations(season, soil, weather) {
    const seasonKey = season.toLowerCase();
    const soilKey   = normalizeSoilKey(soil);

    let crops = CROP_DB[seasonKey]?.[soilKey] ?? CROP_DB[seasonKey]?.loamy ?? CROP_DB["kharif (rainy)"].loamy;

    // If live weather is bad, reduce confidence scores realistically
    crops = crops.map((crop) => {
        let adjusted = crop.confidence;

        // High temperature penalty
        if (weather.temperature > 40) adjusted -= 8;
        else if (weather.temperature > 38) adjusted -= 4;

        // Low humidity penalty (drought stress)
        if (weather.humidity < 40) adjusted -= 6;
        else if (weather.humidity < 50) adjusted -= 3;

        // Rain bonus for Kharif
        if (seasonKey.includes("kharif") && weather.rainfall > 0) adjusted += 3;

        // Clamp between 30–99
        adjusted = Math.min(99, Math.max(30, adjusted));

        return { ...crop, confidence: adjusted };
    });

    // Sort by adjusted confidence descending
    crops.sort((a, b) => b.confidence - a.confidence);

    return crops;
}


export function calculateRisk(weather, land) {
    let score = 0;

    if (weather.temperature > 40)        score += 3;
    else if (weather.temperature > 38)   score += 2;
    else if (weather.temperature > 35)   score += 1;

    if (weather.humidity < 35)           score += 3;
    else if (weather.humidity < 45)      score += 2;
    else if (weather.humidity < 55)      score += 1;

    if (weather.windSpeed > 50)          score += 2;
    else if (weather.windSpeed > 30)     score += 1;

    if (land > 30)                       score += 1;

    if (score >= 5) return "High";
    if (score >= 2) return "Medium";
    return "Low";
}

export { CROP_DB };