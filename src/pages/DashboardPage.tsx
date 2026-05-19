// src/pages/DashboardPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, TrendingUp, Shield, Gift, Beaker, ShoppingBag, ArrowRight, Sprout, MapPin, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardPageProps {
  currentUser: any;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  const { translations, language } = useLanguage();
  const T = translations.dashboardPage || {};

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
