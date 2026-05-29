// src/pages/WeatherPage.tsx

import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, AlertTriangle, Thermometer, Sun, CloudRain, Lightbulb, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getWeatherBasedAdvice } from '../services/aiService';

interface WeatherPageProps {
    currentUser: any;
}

const WeatherPage: React.FC<WeatherPageProps> = ({ currentUser }) => {
    const { translations, language } = useLanguage();
    const T = translations.weatherPage || {};

    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCity] = useState<string>(
        currentUser?.location && currentUser.location !== 'Your Farm'
            ? currentUser.location.split(',')[0].trim()
            : 'Ahmedabad'
    );

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [selectedCity, API_KEY]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner w-12 h-12"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert-error">
                <AlertTriangle className="w-5 h-5" />
                <div>
                    <p className="font-bold">Error loading weather</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const temp = weatherData?.main?.temp || 0;
    const feelsLike = weatherData?.main?.feels_like || 0;
    const humidity = weatherData?.main?.humidity || 0;
    const windSpeed = weatherData?.wind?.speed || 0;
    const description = weatherData?.weather?.[0]?.description || 'Clear';

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Cloud className="w-8 h-8 text-blue-600" />
                    <h1 className="section-title mb-0">{T.weatherCenter?.[language] || 'Weather'}</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{selectedCity}</p>
            </div>

            {/* Current Weather */}
            <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {Math.round(temp)}°C
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 capitalize">
                            {description}
                        </p>
                    </div>
                    <Sun className="w-24 h-24 text-amber-500" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {T.feelsLike?.[language] || 'Feels Like'}
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {Math.round(feelsLike)}°C
                        </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {T.humidity?.[language] || 'Humidity'}
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {humidity}%
                        </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Wind className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {T.windSpeed?.[language] || 'Wind'}
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {Math.round(windSpeed)} km/h
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather Alert */}
            <div className="alert-warning">
                <AlertTriangle className="w-5 h-5" />
                <div>
                    <p className="font-bold">
                        {T.alertTitle?.[language] || 'Weather Advisory'}
                    </p>
                    <p className="text-sm">
                        {T.alertAdvice?.[language] || 'High temperature expected. Ensure adequate irrigation.'}
                    </p>
                </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="card p-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    5-Day Forecast
                </h2>
                <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((day) => (
                        <div key={day} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Day {day}
                            </div>
                            <CloudRain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {Math.round(temp - day)}°C
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Farming Advice */}
            <AIFarmingAdvice weatherData={weatherData} currentUser={currentUser} />
        </div>
    );
};

// AI Farming Advice Component
const AIFarmingAdvice: React.FC<{ weatherData: any; currentUser: any }> = ({ weatherData, currentUser }) => {
    const [aiAdvice, setAiAdvice] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAIAdvice = async () => {
            if (!weatherData) return;

            setLoading(true);
            try {
                const temp = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const rainfall = weatherData.rain?.['1h'] || 0;
                const cropType = currentUser?.farmerProfile?.primaryCrop || 'General';

                const advice = await getWeatherBasedAdvice(temp, humidity, rainfall, cropType);
                setAiAdvice(advice);
            } catch (error) {
                console.error('AI Advice Error:', error);
                // Fallback to static advice
                setAiAdvice([
                    'Temperature is high. Water crops in early morning or evening.',
                    'Low wind speed is ideal for pesticide application.',
                    'Monitor crops for heat stress symptoms.'
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAIAdvice();
    }, [weatherData, currentUser]);

    return (
        <div className="card p-6">
            <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-600" />
                AI Farming Advice
            </h2>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : (
                <div className="space-y-3">
                    {aiAdvice.map((advice, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
                        >
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                {i + 1}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 flex-1">
                                {advice}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherPage;