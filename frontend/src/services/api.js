import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    console.log(`📤 API ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error ||
            error.message ||
            "An unexpected error occurred";
        console.error("❌ API Error:", message);
        return Promise.reject(new Error(message));
    }
);


/**
 * POST /api/predict
 * Sends farm details → receives live weather + AI crop recommendations
 */
export const getPrediction = (data) => API.post("/predict", data);

/**
 * GET /api/history
 * Fetches all saved predictions from MongoDB for the Dashboard
 */
export const getHistory = (params = {}) => API.get("/history", { params });

/**
 * GET /api/history/:id
 */
export const getPredictionById = (id) => API.get(`/history/${id}`);

/**
 * DELETE /api/history/:id
 */
export const deletePrediction = (id) => API.delete(`/history/${id}`);

/**
 * GET /api/health
 * Check if backend is online
 */
export const checkHealth = () => API.get("/health");

export default API;