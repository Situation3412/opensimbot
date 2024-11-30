import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

export const Header: React.FC = () => {
  const { config } = useConfig();
  
  return (
    <nav className={`border-b ${config.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className={`flex items-center ${config.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Open SimBot
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/best-in-bag"
                className={`inline-flex items-center px-1 pt-1 ${
                  config.theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Best in Bag
              </Link>
              <Link 
                to="/single-sim"
                className={`inline-flex items-center px-1 pt-1 ${
                  config.theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Single Sim
              </Link>
              <Link 
                to="/upgrade-finder"
                className={`inline-flex items-center px-1 pt-1 ${
                  config.theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upgrade Finder
              </Link>
              <Link 
                to="/settings"
                className={`inline-flex items-center px-1 pt-1 ${
                  config.theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 