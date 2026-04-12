const crops = require("./cropData");

const getBestCrop = (soilType, season) => {
    const match = crops.find(
        (c) => c.soil === soilType && c.season === season
    );

    if (match) {
        return match;
    }

    // fallback
    return {
        crop: "Rice",
        baseRisk: "High",
        advice: "General crop recommended due to no exact match.",
    };
};

module.exports = getBestCrop;