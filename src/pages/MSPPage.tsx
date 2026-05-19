// src/pages/MSPPage.tsx

import React, { useState } from 'react';
import { TrendingUp, Search, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const MSPPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');

  const seasons = [
    { id: 'all', name: 'All Seasons' },
    { id: 'kharif', name: 'Kharif' },
    { id: 'rabi', name: 'Rabi' }
  ];

  const mspData = [
    {
      crop: 'Wheat',
      season: 'rabi',
      msp2025: 2275,
      msp2024: 2125,
      change: 7.1,
      unit: 'quintal'
    },
    {
      crop: 'Paddy (Common)',
      season: 'kharif',
      msp2025: 2300,
      msp2024: 2183,
      change: 5.4,
      unit: 'quintal'
    },
    {
      crop: 'Paddy (Grade A)',
      season: 'kharif',
      msp2025: 2320,
      msp2024: 2203,
      change: 5.3,
      unit: 'quintal'
    },
    {
      crop: 'Cotton (Medium)',
      season: 'kharif',
      msp2025: 7020,
      msp2024: 6620,
      change: 6.0,
      unit: 'quintal'
    },
    {
      crop: 'Sugarcane',
      season: 'all',
      msp2025: 340,
      msp2024: 315,
      change: 7.9,
      unit: 'quintal'
    },
    {
      crop: 'Soybean',
      season: 'kharif',
      msp2025: 4892,
      msp2024: 4600,
      change: 6.3,
      unit: 'quintal'
    },
    {
      crop: 'Groundnut',
      season: 'kharif',
      msp2025: 6377,
      msp2024: 6000,
      change: 6.3,
      unit: 'quintal'
    },
    {
      crop: 'Maize',
      season: 'kharif',
      msp2025: 2225,
      msp2024: 2090,
      change: 6.5,
      unit: 'quintal'
    },
    {
      crop: 'Barley',
      season: 'rabi',
      msp2025: 1850,
      msp2024: 1735,
      change: 6.6,
      unit: 'quintal'
    },
    {
      crop: 'Gram (Chana)',
      season: 'rabi',
      msp2025: 5440,
      msp2024: 5100,
      change: 6.7,
      unit: 'quintal'
    }
  ];

  const filteredData = mspData.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = selectedSeason === 'all' || item.season === selectedSeason || item.season === 'all';
    return matchesSearch && matchesSeason;
  });

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4" />;
    if (change < 0) return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (change < 0) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-emerald-600" />
          <h1 className="section-title mb-0">MSP Rates 2025-26</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Minimum Support Prices for major crops
        </p>
      </div>

      {/* Info Banner */}
      <div className="card p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
              Average MSP Increase: 6.5%
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Government announces new MSP rates for 2025-26 crop year. All rates effective from procurement season.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedSeason === season.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {season.name}
            </button>
          ))}
        </div>
      </div>

      {/* MSP Table */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
          Crop Prices
        </h2>

        <div className="space-y-3">
          {filteredData.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {item.crop}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {item.season === 'all' ? 'Year Round' : item.season}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    2025-26
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{item.msp2025}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    per {item.unit}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    2024-25
                  </div>
                  <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    ₹{item.msp2024}
                  </div>
                </div>

                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm ${getTrendColor(item.change)}`}>
                  {getTrendIcon(item.change)}
                  {Math.abs(item.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No crops found matching your search
          </div>
        )}
      </div>

      {/* Note */}
      <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Note:</strong> MSP rates are subject to government revisions. Please check with your local procurement center for the latest rates and procurement schedules.
        </p>
      </div>
    </div>
  );
};

export default MSPPage;