// src/pages/LandingPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, TrendingUp, Shield, Gift, Beaker, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    { icon: Cloud, title: 'Weather Forecast', description: 'Real-time weather updates for better planning' },
    { icon: TrendingUp, title: 'Market Prices', description: 'Latest MSP rates and market trends' },
    { icon: Shield, title: 'Crop Insurance', description: 'Protect your crops easily' },
    { icon: Gift, title: 'Govt. Schemes', description: 'Access PM-Kisan and more' },
    { icon: Beaker, title: 'Soil Analysis', description: 'Get fertilizer recommendations' },
    { icon: ShoppingBag, title: 'Marketplace', description: 'Buy seeds and equipment' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">किsan Shakti</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/blog" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
              Blog
            </Link>
            <ThemeSwitcher />
            <button onClick={onGetStarted} className="btn-primary">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Trusted by 50,000+ Farmers
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                  Smarter Farming Starts Here
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  All-in-one platform for weather, prices, insurance, schemes, and marketplace.
                </p>
                <button onClick={onGetStarted} className="btn-primary text-lg px-8 py-4">
                  Start Free <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
              </div>

              <div className="relative">
                <div className="card p-8">
                  <img
                    src="/images/hero.png"
                    alt="Farmer using app"
                    className="w-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50K+', label: 'Farmers' },
                { value: '18+', label: 'States' },
                { value: '45+', label: 'Crops' },
                { value: '100+', label: 'Schemes' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="section-title">Everything You Need</h2>
              <p className="section-subtitle">Simple tools for modern farming</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} onClick={onGetStarted} className="card-interactive p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-green-600">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-xl text-green-100 mb-8">Join thousands of farmers already using Kisan Shakti</p>
            <button onClick={onGetStarted} className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
              Get Started For Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl">किsan Shakti</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Empowering farmers with technology and data
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-green-600">Weather</a></li>
                <li><a href="#" className="hover:text-green-600">Marketplace</a></li>
                <li><a href="#" className="hover:text-green-600">Schemes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-green-600">About</a></li>
                <li><a href="#" className="hover:text-green-600">Privacy</a></li>
                <li><a href="#" className="hover:text-green-600">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Kisan Shakti. Made with ❤️ for Indian farmers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
