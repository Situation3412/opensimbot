import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { BsList, BsX } from 'react-icons/bs';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/best-in-bag', label: 'Best in Bag' },
  { path: '/single-sim', label: 'Single Sim' },
  { path: '/upgrade-finder', label: 'Upgrade Finder' },
  { path: '/settings', label: 'Settings' }
];

export const Navigation: React.FC = () => {
  const { config } = useConfig();
  const location = useLocation();
  const isDark = config.theme === 'dark';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Open SimBot
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${location.pathname === item.path
                    ? isDark
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
            <div className="ml-4">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`
                inline-flex items-center justify-center p-2 rounded-md
                ${isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {isMobileMenuOpen ? (
                <BsX className="block h-6 w-6" />
              ) : (
                <BsList className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                block px-3 py-2 rounded-md text-base font-medium
                ${location.pathname === item.path
                  ? isDark
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
          <div className="px-3 py-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}; 