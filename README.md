# किsan Shakti (Kisan Shakti) — Smart Crop Advisory & IoT Telemetry System

Kisan Shakti (किsan Shakti) is a cutting-edge, dual-role agricultural ecosystem designed for the **Smart India Hackathon (SIH)**. The platform bridges the digital divide for Indian farmers by delivering real-time, context-aware AI crop advice, IoT farm telemetry monitoring, AI-driven Mandi price predictions, automated soil report scanning, and a direct Farm-to-Consumer (F2C) e-commerce marketplace.

---

## 🚀 Key Innovation Pillars

### 1. 📡 Live IoT Telemetry & Farm Automation
*   **Real-time Sensor Monitoring**: Simulates continuous telemetry streams over LoRaWAN (Soil Moisture, Ambient Temperature, N-P-K chemical status).
*   **Smart Irrigation pump Controller**: Allows farmers to toggle micro-irrigation pumps with built-in Lora command latency and context-aware smart agricultural shutting recommendations.

### 2. 📈 AI Mandi Market Price Forecasting
*   **Temporal Trend Predictor**: Interactive price curves plotted via `recharts` projecting 6-month Mandi price trends per crop and state markets.
*   **Mandi Intelligence Insight**: Detailed AI-driven advice providing precise hold-or-sell timings to maximize profit margins.

### 3. 📄 Automated Soil Report OCR Scan (Bridge)
*   **Instant Document Upload**: Dashed upload zone accepting images/PDFs of KVK lab reports.
*   **Auto-populate OCR Form**: Scans document with Tesseract OCR, parses with LLMs via OpenRouter, and automatically populates N, P, K, pH, and organic nutrients into the manual advisor form.

### 4. 🎙️ Floating Multilingual Voice AI Assistant
*   **Context-Aware Dialogues**: Chatbot automatically incorporates local weather patterns, the farmer's primary crop, soil variety, and GPS location.
*   **Voice Control & Speak-Back**: Uses SpeechRecognition (STT) and Web Speech Synthesis (TTS) with local Indian accents for seamless hands-free farming operation.

---

## 🛠️ Technology Stack

*   **Vite React Frontend**: Styled with Tailwind CSS, Lucide Icons, and Recharts.
*   **Firebase Suite**: Firebase Authentication + Firestore Database (real-time plot tracking, diagnostic history, and profile synchronization).
*   **Express Node.js Backend**: Multi-stage pipeline running Tesseract.js OCR and PDF-to-image pre-processing on Port 5174.
*   **AI Integration**: Llama-3.3-70b-specdec (via Groq Client-Side with automatic local fallback) + Llama-3-8b-instruct (via OpenRouter Server-Side).

---

## 📦 Project Directory Structure

```
kisan-shakti/
├── src/
│   ├── components/
│   │   ├── AIAssistant.tsx        # Speech-enabled contextual chatbot
│   │   ├── Layout.tsx             # Main farmer-role responsive shell
│   │   └── Layout_c.tsx           # Consumer e-commerce sidebar layout
│   ├── pages/
│   │   ├── DashboardPage.tsx      # Stat counters + IoT Telemetry console
│   │   ├── MSPPage.tsx            # Price tables + Recharts AI Predictor
│   │   ├── SoilReportPage.tsx     # Manual inputs + OCR upload bridge
│   │   └── CropHealthPage.tsx     # Symptoms diagnosis & treatments list
│   ├── services/
│   │   ├── firebase.ts            # Firestore and Auth initialization
│   │   └── aiService.ts           # LLM handlers with offline simulations
│   └── App.tsx                    # React Router paths & role controllers
├── server/
│   ├── server.js                  # Multer + Tesseract OCR + OpenRouter parsing
│   └── uploads/                   # Temporary directory for scanned reports
├── package.json                   # Concurrently startup and dependencies
└── tsconfig.json                  # React compiler configurations
```

---

## ⚡ Quick Start (Local Setup)

### 1. Pre-requisites
*   Ensure **Node.js v18+** is installed on your local computer.
*   Setup your environment files.

### 2. Configure Environment Variables

Create `.env.local` in the **root** folder:
```env
VITE_FIREBASE_API_KEY='your_firebase_key'
VITE_FIREBASE_AUTH_DOMAIN='smart-farm-xxxxx.firebaseapp.com'
VITE_FIREBASE_PROJECT_ID='smart-farm-xxxxx'
VITE_FIREBASE_STORAGE_BUCKET='smart-farm-xxxxx.appspot.com'
VITE_FIREBASE_MESSAGING_SENDER_ID='your_sender_id'
VITE_FIREBASE_APP_ID='your_app_id'
VITE_OPENWEATHER_API_KEY='your_openweathermap_api_key'
VITE_GROQ_API_KEY='your_groq_api_key' # Leave empty to use offline farming simulator fallback!
```

Create `.env` in the **root** folder:
```env
OPENROUTER_API_KEY="your_openrouter_api_key"
```

### 3. Install & Start Development Servers
You can run both the Vite client-side server and the Express document-scanning backend simultaneously using a single command:

```bash
# 1. Install dependencies
npm install

# 2. Start frontend (Vite) and backend (Express) concurrently
npm start
```
*   **Vite Frontend** runs at: `http://localhost:5173`
*   **Express Backend** runs at: `http://localhost:5174`

---

## 🔒 Firebase Security Rules & Offline Robustness
To ensure a robust, bulletproof demonstration:
1.  **Direct AI Fail-safe**: If `VITE_GROQ_API_KEY` is not present, all frontend services safely fall back to an offline simulated agricultural intelligence engine. It contextually processes prompts (soil NPK metrics, blight disease symptoms, weather guidelines) and generates realistic farming Prescriptions.
2.  **Weather Fallback**: If GPS coordinates or profiles are unset or invalid, the layout gracefully defaults weather telemetry to Ahmedabad (`Ahmedabad`) using the active `VITE_OPENWEATHER_API_KEY` to prevent layout crashes.
