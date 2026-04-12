const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const predictionRoutes = require("./routes/predictionRoutes");

// Load env variables
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());

const cors = require("cors");
app.use(cors());

// after app.use(express.json())
app.use("/api", predictionRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("FarmAssist API is running...");
});

// Error middleware
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});