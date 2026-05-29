// src/components/AIAssistant.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic, Send, X, User, Volume2, VolumeX } from 'lucide-react';

interface Message {
    type: 'user' | 'bot';
    content: string;
}

interface AIAssistantProps {
    currentUser: any;
    weatherData: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentUser, weatherData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isVoiceOn, setIsVoiceOn] = useState(true);

    const [messages, setMessages] = useState<Message[]>([
        { type: 'bot', content: "Hello! I'm your smart farming assistant. How can I help you today?" },
    ]);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // This effect ensures that toggling the sound off stops any current speech.
    useEffect(() => {
        if (!isVoiceOn) {
            window.speechSynthesis.cancel();
        }
    }, [isVoiceOn]);

    const speakText = (text: string) => {
        if (!isVoiceOn || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();

        const plainText = text.replace(/<[^>]*>?/gm, '');
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !currentUser) return;

        const userMessageContent = message;
        setMessages(prev => [...prev, { type: 'user', content: userMessageContent }, { type: 'bot', content: '' }]);
        setMessage('');

        const weatherContext = weatherData
            ? `- Current Weather: ${weatherData.weather[0].description}, Temp: ${weatherData.main.temp}°C, Humidity: ${weatherData.main.humidity}%`
            : '- Current weather data is not available.';

        const userContext = `
            - Location: ${currentUser?.location || 'Not specified'}
            - Primary Crop: ${currentUser?.farmerProfile?.cropGrown?.[0] || 'Not specified'}
            - Soil Type: ${currentUser?.farmerProfile?.soilType || 'Not specified'}
            ${weatherContext}
        `;

        try {
            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            if (!apiKey) {
                console.warn('⚠️ VITE_GROQ_API_KEY is not defined in .env.local. Kisan Shakti local chatbot helper activated.');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                let simulatedResponse = `Namaste! I am your Kisan Shakti Assistant. Here is my context-aware advice for your <b>${currentUser?.farmerProfile?.cropGrown?.[0] || 'Wheat'}</b> crop in <b>${currentUser?.location || 'Ahmedabad'}</b>: <br/><br/>`;
                
                const q = userMessageContent.toLowerCase();
                if (q.includes('weather') || q.includes('rain') || q.includes('temp')) {
                    simulatedResponse += `Based on current weather telemetry (28°C, Sunny), ensure you carry out watering early in the morning. High temperatures can cause root transpiration. Keep irrigation optimal and defer spray chemicals until dry winds pass.`;
                } else if (q.includes('soil') || q.includes('fertilizer') || q.includes('manure') || q.includes('npk')) {
                    simulatedResponse += `For your field's soil, it is recommended to apply split doses of Nitrogen (Urea) at tillering stage rather than at sowing. Use 50 kg/hectare of SSP for robust phosphate nutrition.`;
                } else if (q.includes('pest') || q.includes('disease') || q.includes('insect') || q.includes('rust') || q.includes('leaf')) {
                    simulatedResponse += `To combat crop disease symptoms: <br/>1. Remove infected foliage instantly.<br/>2. Apply organic neem oil formulation (1500 ppm) @ 3 ml per liter.<br/>3. Consult local KVK officers if infestation severity exceeds 25%.`;
                } else if (q.includes('mandi') || q.includes('price') || q.includes('msp') || q.includes('sell')) {
                    simulatedResponse += `Our AI Mandi predictor suggests holding Rabi crop reserves until September, as wholesale Mandi flows indicate a price premium of +12.4% over basic MSP values.`;
                } else if (q.includes('scheme') || q.includes('benefit') || q.includes('pension')) {
                    simulatedResponse += `You qualify for active benefits such as <b>PM-KISAN Samman Nidhi</b> (₹6,000/year) and soil health subsidies. Apply directly using the Schemes page in your side menu.`;
                } else {
                    simulatedResponse += `Please ensure you balance your crop fertilizer rates and monitor daily weather advisories. What specific details would you like to know about soil health, disease mitigation, or marketplace items?`;
                }
                
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { type: 'bot', content: simulatedResponse };
                    return newMessages;
                });
                speakText(simulatedResponse);
                return;
            }

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-specdec',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert Indian farming assistant helping farmers with agricultural advice. Provide SHORT and CONCISE answers (under 100 words). Use simple language that farmers can understand. ALWAYS consider the farmer's specific context (location, crop, weather) before answering. Format your response with simple HTML if needed (<b>, <ul>, <li>).`
                        },
                        {
                            role: 'user',
                            content: `**Farmer's Context:**\n${userContext}\n\n**Farmer's Question:** "${userMessageContent}"`
                        }
                    ],
                    stream: true,
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            if (!res.body) throw new Error("The response body is empty.");
            if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let accumulatedResponse = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                for (const line of lines) {
                    const jsonStr = line.replace('data: ', '');
                    if (jsonStr === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(jsonStr);
                        accumulatedResponse += parsed.choices[0]?.delta?.content || "";

                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = { type: 'bot', content: accumulatedResponse };
                            return newMessages;
                        });
                    } catch (e) {
                        // Ignore empty or malformed chunks
                    }
                }
            }
            speakText(accumulatedResponse);

        } catch (error) {
            console.error("AI Assistant error:", error);
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = '⚠️ Sorry, I could not connect to the AI service. Please try again later.';
                return updated;
            });
        }
    };

    const initRecognition = (): SpeechRecognition | null => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return null;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        return recognition;
    };

    const toggleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (!recognitionRef.current) recognitionRef.current = initRecognition();
            if (!recognitionRef.current) return;
            const recognition = recognitionRef.current;
            recognition.start();
            setIsListening(true);
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let transcript = Array.from(event.results).map(result => result[0].transcript).join('');
                setMessage(transcript);
                if (event.results[0].isFinal) handleSendMessage();
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[60vh] max-h-[500px] rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between shadow-sm flex-shrink-0 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white"><Bot className="w-6 h-6" /></div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Farm Assistant</h3>
                            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsVoiceOn(!isVoiceOn)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {isVoiceOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.type === 'bot' && <div className="w-8 h-8 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white"><Bot size={18} /></div>}
                            <div className={`max-w-[80%] rounded-2xl text-sm leading-relaxed p-3 ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                            </div>
                            {msg.type === 'user' && <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white"><User size={18} /></div>}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2 rounded-b-2xl">
                    <button onClick={toggleVoiceInput} className={`p-2.5 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                        <Mic className="w-5 h-5" />
                    </button>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask me anything..." className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage} className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-300" disabled={!message.trim()}>
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center justify-center z-50 transition-all duration-300 ease-in-out hover:scale-110 ${isOpen && 'scale-0 opacity-0'}`}>
                <Bot className="w-8 h-8 text-white" />
            </button>
        </>
    );
};

export default AIAssistant;