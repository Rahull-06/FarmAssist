const validatePrediction = (req, res, next) => {
    const { region, soilType, season, acres } = req.body;

    // Check required fields
    if (!region || !soilType || !season || !acres) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Check acres is valid number
    if (isNaN(acres) || acres <= 0) {
        return res.status(400).json({
            success: false,
            message: "Acres must be a positive number",
        });
    }

    // Allowed values (important)
    const validSoils = ["loamy", "clay", "sandy"];
    const validSeasons = ["summer", "winter", "rainy"];

    if (!validSoils.includes(soilType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid soil type",
        });
    }

    if (!validSeasons.includes(season)) {
        return res.status(400).json({
            success: false,
            message: "Invalid season",
        });
    }

    next();
};

module.exports = validatePrediction;