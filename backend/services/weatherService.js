import axios from "axios";

// ── Telangana District → Lat/Lon coordinates ─────────────────────────────────
// Used to get precise weather for each district from OpenWeatherMap
const DISTRICT_COORDS = {
    "Adilabad":                  { lat: 19.6641, lon: 78.5320, city: "Adilabad" },
    "Bhadradri Kothagudem":      { lat: 17.5560, lon: 80.6197, city: "Kothagudem" },
    "Hyderabad":                 { lat: 17.3850, lon: 78.4867, city: "Hyderabad" },
    "Jagtial":                   { lat: 18.7950, lon: 78.9147, city: "Jagtial" },
    "Jangaon":                   { lat: 17.7226, lon: 79.1520, city: "Jangaon" },
    "Jayashankar Bhupalpally":   { lat: 18.4356, lon: 79.8918, city: "Bhupalpally" },
    "Jogulamba Gadwal":          { lat: 16.2342, lon: 77.8020, city: "Gadwal" },
    "Kamareddy":                 { lat: 18.3205, lon: 78.3326, city: "Kamareddy" },
    "Karimnagar":                { lat: 18.4386, lon: 79.1288, city: "Karimnagar" },
    "Khammam":                   { lat: 17.2473, lon: 80.1514, city: "Khammam" },
    "Kumuram Bheem":             { lat: 19.2804, lon: 79.5926, city: "Asifabad" },
    "Mahabubabad":               { lat: 17.6015, lon: 80.0043, city: "Mahabubabad" },
    "Mahabubnagar":              { lat: 16.7371, lon: 77.9824, city: "Mahabubnagar" },
    "Mancherial":                { lat: 18.8706, lon: 79.4576, city: "Mancherial" },
    "Medak":                     { lat: 18.0442, lon: 78.2637, city: "Medak" },
    "Medchal-Malkajgiri":        { lat: 17.5200, lon: 78.5800, city: "Medchal" },
    "Mulugu":                    { lat: 18.1967, lon: 80.0726, city: "Mulugu" },
    "Nagarkurnool":              { lat: 16.4827, lon: 78.3251, city: "Nagarkurnool" },
    "Nalgonda":                  { lat: 17.0575, lon: 79.2679, city: "Nalgonda" },
    "Narayanpet":                { lat: 16.7450, lon: 77.4960, city: "Narayanpet" },
    "Nirmal":                    { lat: 19.0946, lon: 78.3440, city: "Nirmal" },
    "Nizamabad":                 { lat: 18.6725, lon: 78.0940, city: "Nizamabad" },
    "Peddapalli":                { lat: 18.6144, lon: 79.3833, city: "Peddapalli" },
    "Rajanna Sircilla":          { lat: 18.3861, lon: 78.8326, city: "Sircilla" },
    "Rangareddy":                { lat: 17.3200, lon: 78.3400, city: "Rangareddy" },
    "Sangareddy":                { lat: 17.6269, lon: 78.0878, city: "Sangareddy" },
    "Siddipet":                  { lat: 18.1018, lon: 78.8520, city: "Siddipet" },
    "Suryapet":                  { lat: 17.1415, lon: 79.6222, city: "Suryapet" },
    "Vikarabad":                 { lat: 17.3380, lon: 77.9028, city: "Vikarabad" },
    "Wanaparthy":                { lat: 16.3629, lon: 78.0580, city: "Wanaparthy" },
    "Warangal Rural":            { lat: 17.9689, lon: 79.5941, city: "Warangal" },
    "Warangal Urban":            { lat: 17.9784, lon: 79.5941, city: "Warangal" },
    "Yadadri Bhuvanagiri":       { lat: 17.5986, lon: 78.8849, city: "Bhongir" },
};

/**
 * Fetch LIVE weather data from OpenWeatherMap for a given Telangana district.
 * Returns structured weather object for use in predictions and AI advice.
 */
export async function getLiveWeather(district) {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        throw new Error("WEATHER_API_KEY is not set in .env");
    }

    const coords = DISTRICT_COORDS[district];
    if (!coords) {
        throw new Error(`District "${district}" not found in coordinates database`);
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather`;
        const response = await axios.get(url, {
            params: {
                lat:   coords.lat,
                lon:   coords.lon,
                appid: apiKey,
                units: "metric",
                lang:  "en",
            },
            timeout: 8000,
        });

        const data = response.data;

        const weather = {
            temperature: Math.round(data.main.temp),
            feelsLike:   Math.round(data.main.feels_like),
            humidity:    data.main.humidity,                         // %
            rainfall:    data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0, // mm
            condition:   capitalizeFirst(data.weather[0].description),
            windSpeed:   Math.round(data.wind.speed * 3.6),         // m/s → km/h
            pressure:    data.main.pressure,                         // hPa
            visibility:  Math.round((data.visibility ?? 10000) / 1000), // m → km
            cloudCover:  data.clouds.all,                            // %
            source:      "OpenWeatherMap",
            fetchedAt:   new Date().toISOString(),
            cityName:    data.name,
            country:     data.sys.country,
        };

        console.log(`✅ Live weather fetched for ${district}: ${weather.temperature}°C, ${weather.condition}`);
        return weather;

    } catch (error) {
        if (error.response) {
            // API responded with error status
            const status = error.response.status;
            if (status === 401) throw new Error("Invalid OpenWeatherMap API key. Check WEATHER_API_KEY in .env");
            if (status === 429) throw new Error("OpenWeatherMap rate limit exceeded. Free tier: 60 calls/minute");
            throw new Error(`OpenWeatherMap API error: ${status} - ${error.response.data?.message}`);
        }
        if (error.code === "ECONNABORTED") {
            throw new Error("Weather API timeout. Check your internet connection.");
        }
        throw new Error(`Weather fetch failed: ${error.message}`);
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { DISTRICT_COORDS };