import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Menu, X, Home, Cloud, TrendingUp, Shield, Gift, Users, Beaker, ShoppingBag, User, Settings, LogOut, Map, Sun, Moon, Languages, ShoppingCart, Award, ShieldCheck, Newspaper, Tag } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import AIAssistant from './AIAssistant';

interface LayoutProps {
  onLogout: () => void;
  currentUser: any;
}

const Layout: React.FC<LayoutProps> = ({ onLogout, currentUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const location = currentUser?.location && currentUser.location !== 'Your Farm' 
        ? currentUser.location.split(',')[0].trim() 
        : 'Ahmedabad';
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '6cda69c02716a49abcc0cc15bb1377b1';
      
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
          throw new Error('Weather data not found');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setWeatherData(null);
      }
    };

    fetchWeatherData();
  }, [currentUser]);


  const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Weather', href: '/weather', icon: Cloud },
    { name: 'MSP Rates', href: '/msp', icon: TrendingUp },
    { name: 'Farm Tracking', href: '/farm-tracking', icon: Map },
    { name: 'Soil Analysis', href: '/soil', icon: Beaker },
    { name: 'Crop Doctor', href: '/crop-health', icon: ShieldCheck },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Sell Produce', href: '/sell', icon: Tag }, // <-- ADD THIS LINE
    { name: 'Govt. Schemes', href: '/schemes', icon: Award },
    { name: 'Insurance', href: '/insurance', icon: Shield },
    { name: 'Referral', href: '/referral', icon: Gift },
    { name: 'Blog', href: '/blog', icon: Newspaper },
  ];

  const NavLinkItem = ({ href, icon: Icon, name }: { href: string; icon: React.ElementType; name: string }) => (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
          ? 'bg-green-600 text-white font-semibold shadow-md'
          : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
        }`
      }
      onClick={() => setIsSidebarOpen(false)}
    >
      <Icon className="w-5 h-5" />
      <span>{name}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 flex flex-col h-full">
          <Link to="/dashboard" className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="font-bold text-xl text-gray-800 dark:text-gray-100">Kisan Shakti</span>
          </Link>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-thin">
            {sidebarLinks.map(link => (
              <NavLinkItem key={link.name} {...link} />
            ))}
          </nav>

          <div className="mt-auto">
            <NavLinkItem href="/profile" icon={User} name="My Profile" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-600 dark:text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1"></div> {/* Spacer */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                <ShoppingCart className="w-6 h-6" />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-green-600 transition-colors">
                    {currentUser?.name?.[0] || 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {currentUser?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {currentUser?.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <AIAssistant currentUser={currentUser} weatherData={weatherData} />
    </div>
  );
};

export default Layout;