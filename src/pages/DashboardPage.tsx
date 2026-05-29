// src/pages/DashboardPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, TrendingUp, Shield, Gift, Beaker, ShoppingBag, ArrowRight, Sprout, MapPin, Sun, Wifi, Activity, Droplets, Thermometer, Zap, Power, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardPageProps {
  currentUser: any;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  const { translations, language } = useLanguage();
  const T = translations.dashboardPage || {};

  const [soilMoisture, setSoilMoisture] = React.useState(42.5);
  const [soilTemp, setSoilTemp] = React.useState(27.8);
  const [pumpActive, setPumpActive] = React.useState(false);
  const [pumpLoading, setPumpLoading] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSoilMoisture(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat(Math.min(Math.max(prev + delta, 38), 45).toFixed(1));
      });
      setSoilTemp(prev => {
        const delta = (Math.random() - 0.5) * 0.2;
        return parseFloat(Math.min(Math.max(prev + delta, 25), 31).toFixed(1));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePumpToggle = () => {
    setPumpLoading(true);
    setTimeout(() => {
      setPumpActive(prev => !prev);
      setPumpLoading(false);
    }, 1500);
  };

  const tools = [
    {
      icon: Cloud,
      title: T.weatherTitle?.[language] || 'Weather',
      description: T.weatherDesc?.[language] || 'Check forecast and alerts',
      path: '/weather',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: T.mspTitle?.[language] || 'Market Prices',
      description: T.mspDesc?.[language] || 'Latest MSP rates',
      path: '/msp',
      color: 'green'
    },
    {
      icon: Beaker,
      title: T.soilTitle?.[language] || 'Soil Test',
      description: T.soilDesc?.[language] || 'Upload and analyze reports',
      path: '/soil',
      color: 'purple'
    },
    {
      icon: Shield,
      title: T.insuranceTitle?.[language] || 'Insurance',
      description: T.insuranceDesc?.[language] || 'Protect your crops',
      path: '/insurance',
      color: 'orange'
    },
    {
      icon: Gift,
      title: T.schemesTitle?.[language] || 'Schemes',
      description: T.schemesDesc?.[language] || 'Government benefits',
      path: '/schemes',
      color: 'indigo'
    },
    {
      icon: ShoppingBag,
      title: T.marketplaceTitle?.[language] || 'Shop',
      description: T.marketplaceDesc?.[language] || 'Buy farm supplies',
      path: '/marketplace',
      color: 'red'
    }
  ];

  const primaryCrop = currentUser?.farmerProfile?.cropGrown?.[0] || 'Wheat';
  const location = currentUser?.location || 'Your Farm';

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{location}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {T.welcome?.[language] || 'Welcome'}, {currentUser.name?.split(' ')[0] || 'Farmer'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {T.productive?.[language] || "Let's make today productive"}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">28°C</div>
              <div className="text-xs text-amber-700 dark:text-amber-400">Sunny</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <div className="stat-label">Primary Crop</div>
          <div className="stat-value text-2xl">{primaryCrop}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rabi Season</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Gift className="w-8 h-8 text-blue-600" />
          </div>
          <div className="stat-label">Active Schemes</div>
          <div className="stat-value text-2xl">4</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">2 Pending</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="stat-label">Market Price</div>
          <div className="stat-value text-2xl">₹2,400</div>
          <div className="stat-change text-green-600 mt-1">+5.2%</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <div className="stat-label">Insurance</div>
          <div className="stat-value text-2xl">Active</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Valid till Dec</div>
        </div>
      </div>

      {/* Live IoT Smart Farming Telemetry */}
      <div className="card p-6 bg-gradient-to-br from-emerald-50/20 to-teal-50/20 dark:from-emerald-950/10 dark:to-teal-950/10 border-emerald-500/20 border-2 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Live Field Telemetry
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Node ID: #K-SHAKTI-0091 (Connected via LoRaWAN)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/30 px-3.5 py-1.5 rounded-full border border-green-200 dark:border-green-900/30">
            <Activity className="w-4 h-4 animate-bounce" />
            Signal: Excellent (-84 dBm)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Soil Moisture */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Soil Moisture</div>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{soilMoisture}%</div>
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">Status: Optimal</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Soil Temperature */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Soil Temperature</div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{soilTemp}°C</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Depth: 10cm</div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
              <Thermometer className="w-6 h-6" />
            </div>
          </div>

          {/* Soil N-P-K Levels */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">NPK Chemical Status</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">Balanced</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">N: 140 | P: 58 | K: 240 ppm</div>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* IoT Controller Pump */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Water Pump Controller</div>
              <div className={`text-lg font-bold mt-1 ${pumpActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {pumpActive ? '🟢 ON & Irrigating' : '🔴 OFF / Standby'}
              </div>
              <button
                onClick={handlePumpToggle}
                disabled={pumpLoading}
                className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  pumpActive
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                } disabled:opacity-50`}
              >
                {pumpLoading ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    {pumpActive ? 'Stop Pump' : 'Start Pump'}
                  </>
                )}
              </button>
            </div>
            <div className={`p-3 rounded-xl transition-all ${pumpActive ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 animate-pulse' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
              <Power className="w-6 h-6" />
            </div>
          </div>
        </div>

        {pumpActive && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3.5 flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              💡 <b>Smart Irrigation Active:</b> AI recommended moisture level is 45%. Water pump will automatically turn off in 12 minutes to conserve groundwater.
            </p>
          </div>
        )}
      </div>

      {/* Main Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Your Tools</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <Link
              to={tool.path}
              key={index}
              className="card-interactive p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                  <tool.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/weather" className="btn-secondary text-center">
            Check Weather
          </Link>
          <Link to="/marketplace" className="btn-secondary text-center">
            Buy Supplies
          </Link>
          <Link to="/soil" className="btn-secondary text-center">
            Upload Report
          </Link>
          <Link to="/schemes" className="btn-primary text-center">
            Apply Scheme
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
