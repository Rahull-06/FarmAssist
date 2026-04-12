const axios = require("axios");

const getWeather = async (city) => {
    const API_KEY = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const res = await axios.get(url);

    return {
        temperature: res.data.main.temp,
        humidity: res.data.main.humidity,
        condition: res.data.weather[0].main,
    };
};

module.exports = getWeather;