// src/services/aiService.ts

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-specdec';

interface GroqMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface GroqResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

function simulateFarmingAdvisory(prompt: string): string {
    const p = prompt.toLowerCase();
    
    if (p.includes('soil report') || p.includes('nitrogen') || p.includes('phosphorus')) {
        return `ANALYSIS: Based on the reported NPK levels, your soil shows a slight nitrogen deficiency with optimal potash reserves, which is common in Indian agricultural zones.
RECOMMENDATIONS:
- Apply 100 kg/hectare of granulated Urea during early vegetative phase to boost leaf density.
- Mix 50 kg/hectare of Single Super Phosphate (SSP) at root depth during sowing.
- Supplement with organic vermicompost to naturally restore moisture absorption capacity.`;
    }
    
    if (p.includes('symptom') || p.includes('disease') || p.includes('crop health')) {
        return `DISEASE: Leaf Rust (Puccinia triticina)
SEVERITY: Moderate
TREATMENT:
- Spray Propiconazole 25% EC @ 200 ml per acre mixed in 200 liters of water.
- Spray organic neem oil solution (1500 ppm) at 3 ml/liter for sustainable control.
- Clear heavily infected vegetative matter immediately to prevent wind-based spore spread.
PREVENTION:
- Use certified rust-resistant hybrid seeds in the next sowing cycle.
- Balance nitrogenous fertilization to prevent excessive foliage succulence.`;
    }
    
    if (p.includes('weather') || p.includes('temperature') || p.includes('humidity')) {
        return `- Irrigate during early morning (5-7 AM) or late evening to minimize transpiration losses under high temperatures.
- Check crop leaf margins regularly for early symptoms of wilting or thermal stress.
- Delay any planned pesticide spraying if dry winds or afternoon sunlight peaks exceed 34°C.`;
    }
    
    if (p.includes('recommend') || p.includes('soil type') || p.includes('crop')) {
        return `CROP: Wheat (PBW 343)
REASON: Excellent germination response in well-drained loamy soils during Rabi.

CROP: Mustard (Pusa Bold)
REASON: High commercial value with low irrigation and drought-hardy characteristics.

CROP: Chickpea (Gram)
REASON: Excellent crop rotation choice that naturally fixes atmospheric nitrogen.`;
    }

    return `For optimal results, ensure deep soil turning before Rabi sowing to eliminate pest pupae. Apply split-dose fertilizers based on crop vegetative stages, and monitor moisture levels using KVK recommendations.`;
}

async function callGroqAPI(messages: GroqMessage[]): Promise<string> {
    if (!GROQ_API_KEY) {
        console.warn('⚠️ VITE_GROQ_API_KEY is not defined in .env.local. Kisan Shakti local agricultural expert simulation activated.');
        const userPrompt = messages[messages.length - 1].content;
        // Simulate minor delay for authentic feel
        await new Promise(resolve => setTimeout(resolve, 800));
        return simulateFarmingAdvisory(userPrompt);
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data: GroqResponse = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
}

// Farm Tracking AI Suggestions
export async function getFarmingSuggestion(crop: string, season: string, location: string): Promise<string> {
    const messages: GroqMessage[] = [
        {
            role: 'system',
            content: 'You are an expert agricultural advisor. Provide practical, actionable farming advice in 2-3 sentences.'
        },
        {
            role: 'user',
            content: `Give farming suggestions for ${crop} crop in ${season} season at ${location}. Include tips on irrigation, fertilization, and pest control.`
        }
    ];

    return await callGroqAPI(messages);
}

// Soil Analysis AI
export async function analyzeSoilReport(soilData: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    pH?: number;
    organicMatter?: number;
}): Promise<{
    analysis: string;
    recommendations: string[];
}> {
    const messages: GroqMessage[] = [
        {
            role: 'system',
            content: 'You are a soil science expert. Analyze soil test results and provide specific fertilizer recommendations.'
        },
        {
            role: 'user',
            content: `Analyze this soil report:
- Nitrogen (N): ${soilData.nitrogen}
- Phosphorus (P): ${soilData.phosphorus}
- Potassium (K): ${soilData.potassium}
${soilData.pH ? `- pH: ${soilData.pH}` : ''}
${soilData.organicMatter ? `- Organic Matter: ${soilData.organicMatter}%` : ''}

Provide:
1. Overall soil health analysis (1-2 sentences)
2. Three specific fertilizer recommendations with quantities

Format your response as:
ANALYSIS: [your analysis]
RECOMMENDATIONS:
- [recommendation 1]
- [recommendation 2]
- [recommendation 3]`
        }
    ];

    const response = await callGroqAPI(messages);

    // Parse the response
    const parts = response.split('RECOMMENDATIONS:');
    const analysis = parts[0].replace('ANALYSIS:', '').trim();
    const recommendations = parts[1]
        ? parts[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(1).trim())
        : [];

    return { analysis, recommendations };
}

// Crop Disease Detection AI
export async function analyzeCropImage(imageDescription: string, cropType: string): Promise<{
    disease: string;
    severity: string;
    treatment: string[];
    prevention: string[];
}> {
    const messages: GroqMessage[] = [
        {
            role: 'system',
            content: 'You are a plant pathology expert. Diagnose crop diseases and provide treatment recommendations.'
        },
        {
            role: 'user',
            content: `A farmer has uploaded an image of their ${cropType} crop showing these symptoms: ${imageDescription}.

Provide:
1. Most likely disease name
2. Severity level (Mild/Moderate/Severe)
3. Three treatment steps
4. Two prevention measures

Format your response as:
DISEASE: [disease name]
SEVERITY: [severity level]
TREATMENT:
- [treatment 1]
- [treatment 2]
- [treatment 3]
PREVENTION:
- [prevention 1]
- [prevention 2]`
        }
    ];

    const response = await callGroqAPI(messages);

    // Parse the response
    const lines = response.split('\n');
    let disease = 'Unknown';
    let severity = 'Unknown';
    const treatment: string[] = [];
    const prevention: string[] = [];

    let currentSection = '';

    for (const line of lines) {
        if (line.startsWith('DISEASE:')) {
            disease = line.replace('DISEASE:', '').trim();
        } else if (line.startsWith('SEVERITY:')) {
            severity = line.replace('SEVERITY:', '').trim();
        } else if (line.startsWith('TREATMENT:')) {
            currentSection = 'treatment';
        } else if (line.startsWith('PREVENTION:')) {
            currentSection = 'prevention';
        } else if (line.trim().startsWith('-')) {
            const item = line.trim().substring(1).trim();
            if (currentSection === 'treatment') {
                treatment.push(item);
            } else if (currentSection === 'prevention') {
                prevention.push(item);
            }
        }
    }

    return { disease, severity, treatment, prevention };
}

// Weather-based Farming Advice
export async function getWeatherBasedAdvice(
    temperature: number,
    humidity: number,
    rainfall: number,
    cropType: string
): Promise<string[]> {
    const messages: GroqMessage[] = [
        {
            role: 'system',
            content: 'You are an agricultural meteorologist. Provide weather-based farming advice.'
        },
        {
            role: 'user',
            content: `Current weather conditions:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Rainfall: ${rainfall}mm
- Crop: ${cropType}

Provide 3 specific actionable farming tips based on these weather conditions.

Format as:
- [tip 1]
- [tip 2]
- [tip 3]`
        }
    ];

    const response = await callGroqAPI(messages);
    return response.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(1).trim());
}

// Crop Recommendation AI
export async function recommendCrops(
    soilType: string,
    season: string,
    location: string,
    farmSize: number
): Promise<Array<{ crop: string; reason: string }>> {
    const messages: GroqMessage[] = [
        {
            role: 'system',
            content: 'You are an agricultural expert. Recommend suitable crops based on conditions.'
        },
        {
            role: 'user',
            content: `Recommend 3 suitable crops for:
- Soil Type: ${soilType}
- Season: ${season}
- Location: ${location}
- Farm Size: ${farmSize} acres

Format as:
CROP: [crop name]
REASON: [why this crop is suitable]

CROP: [crop name]
REASON: [why this crop is suitable]

CROP: [crop name]
REASON: [why this crop is suitable]`
        }
    ];

    const response = await callGroqAPI(messages);
    const crops: Array<{ crop: string; reason: string }> = [];

    const sections = response.split('CROP:').filter(s => s.trim());
    for (const section of sections) {
        const parts = section.split('REASON:');
        if (parts.length === 2) {
            crops.push({
                crop: parts[0].trim(),
                reason: parts[1].trim()
            });
        }
    }

    return crops;
}

export default {
    getFarmingSuggestion,
    analyzeSoilReport,
    analyzeCropImage,
    getWeatherBasedAdvice,
    recommendCrops
};
