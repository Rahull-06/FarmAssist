<div align="center">

# 🌾 FarmAssist

### AI-Powered Smart Agriculture Advisory Platform

🚀 *Real-Time Data • AI Intelligence • Actionable Farming Insights*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge\&logo=google\&logoColor=white)](https://aistudio.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📌 Overview

**FarmAssist** is a **full-stack AI-powered agriculture advisory system** designed to help farmers make **data-driven decisions**.

It integrates:

* 🌦️ Live weather data
* 🌱 Crop intelligence
* 🤖 AI-generated recommendations

The platform generates **personalized farming advice** based on real-time environmental conditions and stores results for tracking and analysis.

---

## 🎯 Problem Statement

Farmers often rely on:

* Guesswork
* Static advice
* Outdated data

👉 This leads to **low yield, high risk, and financial loss**

---

## 💡 Solution

FarmAssist solves this by:

* Providing **real-time weather-based insights**
* Using **AI (Gemini) for dynamic recommendations**
* Suggesting **best crops + risk levels**
* Maintaining **history for better decisions over time**

---

## ✨ Key Features

* 🌤️ **Live Weather Integration**
  Real-time temperature, humidity, rainfall & wind data

* 🤖 **AI Advisory (Gemini)**
  Generates unique farming advice every time (no templates)

* 🌾 **Smart Crop Recommendation**
  Suggests crops with yield & confidence score

* ⚠️ **Risk Analysis System**
  Classifies farming risk into Low / Medium / High

* 💾 **MongoDB Storage**
  Saves all predictions for future reference

* 📊 **Interactive Dashboard**
  View, filter, and manage past predictions

---

## 🛠 Tech Stack

### 🔹 Frontend

* React 18
* Vite
* Tailwind CSS
* Axios

### 🔹 Backend

* Node.js
* Express.js
* MongoDB Atlas (Mongoose)

### 🔹 APIs & AI

* OpenWeatherMap API
* Google Gemini API

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js (v18+)
* MongoDB Atlas account
* OpenWeatherMap API Key
* Gemini API Key

---

### 📥 Installation

```bash
git clone https://github.com/YOUR_USERNAME/farmassist.git
cd farmassist
```

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

WEATHER_API_KEY=your_weather_key
GEMINI_API_KEY=your_gemini_key
```

Run backend:

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
farmassist/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
```

---

## 📡 API Endpoints

### 🔹 Predict Farm Data

```
POST /api/predict
```

### 🔹 Get History

```
GET /api/history
```

### 🔹 Delete Record

```
DELETE /api/history/:id
```

---

## 📊 Sample Response

```json
{
  "district": "Karimnagar",
  "riskLevel": "Medium",
  "crops": [
    {
      "name": "Cotton",
      "confidence": 91
    }
  ],
  "aiAdvice": "Based on current weather..."
}
```

---

## 🌍 Future Improvements

* 🌐 Multi-language support (Telugu, Hindi)
* 📱 Mobile app version
* 🛰️ Satellite-based soil analysis
* 📈 Yield prediction using ML models

---

## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/your-feature
git commit -m "Added feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Rahul Rathod**

* LinkedIn: https://www.linkedin.com/in/rahullrathod06/
* GitHub: https://github.com/Rahull-06

---

<div align="center">

⭐ If you found this project useful, give it a star!

**FarmAssist — Smarter Farming Starts Here 🌾**

</div>
