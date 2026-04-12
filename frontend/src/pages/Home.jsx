import { useState } from "react";
import { getPrediction } from "../services/api";

const Home = () => {
    const [form, setForm] = useState({
        region: "",
        soilType: "",
        season: "",
        acres: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await getPrediction(form);
            setResult(res.data.data);

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center">

            <div className="bg-white p-8 rounded-3xl shadow-2xl w-[420px] transition hover:scale-[1.01]">

                <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
                    🌱 FarmAssist AI
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Region */}
                    <select
                        name="region"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Region</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                    </select>

                    {/* Soil */}
                    <select
                        name="soilType"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Soil Type</option>
                        <option value="loamy">Loamy</option>
                        <option value="clay">Clay</option>
                        <option value="sandy">Sandy</option>
                    </select>

                    {/* Season */}
                    <select
                        name="season"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Season</option>
                        <option value="summer">Summer</option>
                        <option value="winter">Winter</option>
                        <option value="rainy">Rainy</option>
                    </select>

                    {/* Acres */}
                    <input
                        name="acres"
                        type="number"
                        placeholder="Land in Acres"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "⏳ Analyzing..." : "Analyze"}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}

                {result && (
                    <div className="mt-6 bg-white border rounded-xl p-4 shadow-md">

                        <h3 className="text-lg font-bold text-green-700 mb-2">
                            🌾 Recommendation
                        </h3>

                        <div className="space-y-2">

                            <p>
                                <span className="font-semibold">Crop:</span> {result.crop}
                            </p>

                            <p>
                                <span className="font-semibold">Risk:</span>
                                <span className={`ml-2 px-2 py-1 rounded text-white ${result.risk === "Low" ? "bg-green-500" :
                                    result.risk === "Medium" ? "bg-yellow-500" :
                                        "bg-red-500"
                                    }`}>
                                    {result.risk}
                                </span>
                            </p>

                            {/* Weather Info */}
                            <p><b>🌡 Temperature:</b> {result.weather?.temperature}°C</p>
                            <p><b>💧 Humidity:</b> {result.weather?.humidity}%</p>
                            <p><b>☁️ Condition:</b> {result.weather?.condition}</p>

                            <p>
                                <span className="font-semibold">Advice:</span> {result.advice}
                            </p>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;