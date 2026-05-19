import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
import fetch from 'node-fetch';
import { convert } from 'pdf-poppler';
import * as Jimp from 'jimp';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5174;

// --- FIX: Explicit CORS Configuration ---
// This ensures requests from the default Vite development server are allowed.
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add other origins if needed
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));


const upload = multer({ dest: 'uploads/' });
app.use(express.json());

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const getOpenRouterResponse = async (prompt, model = 'mistralai/mistral-7b-instruct:free') => {
    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5173', // Required by OpenRouter
            'X-Title': 'Kisan Shakti', // Recommended by OpenRouter
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
        }),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter API responded with status: ${response.status}. Body: ${errorBody}`);
    }
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
};

app.post('/api/analyze-soil-report', upload.single('soilReport'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    let imagePath = req.file.path;
    let text = '';

    try {
        if (req.file.mimetype === 'application/pdf') {
            console.log('PDF detected. Converting to image...');
            const outputPngPath = `${req.file.path}.png`;

            const opts = {
                format: 'png',
                out_dir: path.dirname(outputPngPath),
                out_prefix: path.basename(outputPngPath, '.png'),
                page: 1,
                scale_to: 2048
            };

            await convert(req.file.path, opts);
            imagePath = outputPngPath;
            console.log('PDF converted successfully to:', imagePath);
        }

        const image = await Jimp.read(imagePath);
        await image.greyscale().contrast(0.5).writeAsync(imagePath);
        console.log('Image pre-processing complete.');

        console.log(`Performing OCR on: ${imagePath}`);
        const { data } = await Tesseract.recognize(imagePath, 'eng');
        text = data.text;

        if (!text || text.trim().length < 10) {
            return res.status(400).json({ error: 'Could not extract meaningful text.' });
        }
        console.log("Extracted Text:", text);

        console.log("Sending text to OpenRouter for data extraction...");
        const promptForDataExtraction = `
            You are an expert agricultural soil scientist. Analyze the following text extracted from a soil report and structure it into a JSON object. The JSON should have two main keys: "soilData" and "recommendations".

            - "soilData" should be an array of objects. Each object represents a nutrient and must include these keys: "nutrient" (string, e.g., "Nitrogen", "pH"), "value" (number), "ideal" (number, an ideal or sufficient level for this nutrient), and "status" (string, e.g., "Low", "Medium", "High", "Sufficient").
            - "recommendations" should be an array of objects. Each object represents a single recommendation and must include these keys: "type" (string, e.g., "fertilizer", "amendment", "general"), "title" (string, a short headline), "description" (string, a longer explanation), and "priority" (string, either "high", "medium", or "low").

            Here is the extracted text: """${text}"""
        `;
        const parsedData = await getOpenRouterResponse(promptForDataExtraction);
        console.log("Parsed Soil Data from OpenRouter:", parsedData);

        console.log("Sending data to OpenRouter for recommendations...");
        const promptForRecommendations = `
            Based on the following structured soil data, generate expert farming recommendations. The output must be a JSON object with a single key "recommendations".
            - "recommendations" should be an array of objects. Each object represents a single recommendation and must include these keys: "type" (string, e.g., "fertilizer", "amendment", "general"), "title" (string, a short headline), "description" (string, a longer explanation), and "priority" (string, either "high", "medium", or "low").

            Here is the soil data: ${JSON.stringify(parsedData.soilData, null, 2)}
        `;
        const parsedRecommendations = await getOpenRouterResponse(promptForRecommendations);
        console.log("Generated Recommendations from OpenRouter:", parsedRecommendations);

        res.json({
            soilData: parsedData.soilData,
            recommendations: parsedRecommendations.recommendations,
        });

    } catch (error) {
        console.error('Error in /api/analyze-soil-report:', error);
        res.status(500).json({ error: 'An error occurred during analysis. Check server logs.' });

    } finally {
        console.log("Cleaning up temporary files...");
        await fs.unlink(req.file.path).catch(e => console.error("Couldn't unlink original file", e));
        if (imagePath !== req.file.path) {
            await fs.unlink(imagePath).catch(e => console.error("Couldn't unlink converted image", e));
        }
    }
});

// =================================================================
//  NEW: AI CROP DOCTOR ENDPOINT
// =================================================================
app.post('/api/analyze-crop-health', upload.single('cropImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }

    try {
        console.log('Received image for crop health analysis:', req.file.filename);

        // --- AI Model Integration Placeholder ---
        // In a real application, you would load your trained image classification
        // model (e.g., using TensorFlow.js, ONNX Runtime, or by calling a Python script)
        // and pass the image path (req.file.path) to it.

        // For this example, we'll simulate an AI response.
        const simulateAIAnalysis = (filePath) => {
            const possibleResults = [
                {
                    diseaseName: "Tomato Late Blight",
                    confidence: 0.92,
                    description: "Late blight is a destructive disease of tomatoes and potatoes caused by the fungus Phytophthora infestans. It thrives in cool, moist conditions.",
                    treatment: {
                        organic: ["Apply copper-based fungicides.", "Ensure good air circulation around plants.", "Remove and destroy infected leaves immediately."],
                        chemical: ["Mancozeb", "Chlorothalonil"],
                    },
                    recommendedProducts: ["Organic Fertilizer", "Bio Pesticide"],
                },
                {
                    diseaseName: "Cotton Leaf Curl Virus",
                    confidence: 0.88,
                    description: "A viral disease transmitted by whiteflies, causing upward or downward curling of leaves, vein thickening, and stunted growth.",
                    treatment: {
                        organic: ["Introduce natural predators of whiteflies like ladybugs.", "Use yellow sticky traps.", "Spray neem oil solution."],
                        chemical: ["Imidacloprid", "Acetamiprid"],
                    },
                    recommendedProducts: ["Hybrid Cotton Seeds", "Pesticides"],
                }
            ];
            // Randomly pick one of the results for demonstration
            return possibleResults[Math.floor(Math.random() * possibleResults.length)];
        };

        // Simulate a delay to mimic a real AI model processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const analysisResult = simulateAIAnalysis(req.file.path);

        console.log("Simulated AI Result:", analysisResult);
        res.json(analysisResult);

    } catch (error) {
        console.error('Error in /api/analyze-crop-health:', error);
        res.status(500).json({ error: 'An error occurred during crop health analysis. Check server logs.' });
    } finally {
        // Clean up the uploaded file
        await fs.unlink(req.file.path).catch(e => console.error("Couldn't unlink crop image", e));
    }
});


app.listen(port, () => {
    console.log(`✅ Server for Kisan Shakti listening at http://localhost:${port}`);
});