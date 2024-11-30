import React from 'react';
import { BsGearFill, BsLightningFill, BsSearch } from 'react-icons/bs';
import { FeatureCard } from '../components/FeatureCard';
import { useConfig } from '../contexts/ConfigContext';

const features = [
  {
    title: 'Best in Bag',
    description: 'Find the optimal combination of gear from your inventory to maximize your performance.',
    icon: <BsGearFill className="w-6 h-6" />,
    link: '/best-in-bag'
  },
  {
    title: 'Single Sim',
    description: 'Quickly simulate your current gear setup to analyze your performance.',
    icon: <BsLightningFill className="w-6 h-6" />,
    link: '/single-sim'
  },
  {
    title: 'Upgrade Finder',
    description: 'Discover which potential gear upgrades will give you the biggest performance boost.',
    icon: <BsSearch className="w-6 h-6" />,
    link: '/upgrade-finder'
  }
];

export const Home: React.FC = () => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className={`
          text-4xl font-bold mb-4 tracking-tight
          ${isDark ? 'text-bnet-gray-100' : 'text-bnet-gray-900'}
        `}>
          Open SimBot
        </h1>
        <p className={`
          text-xl
          ${isDark ? 'text-bnet-gray-400' : 'text-bnet-gray-600'}
        `}>
          Your open-source World of Warcraft simulation toolkit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      <div className={`
        mt-12 p-6 rounded-lg text-center border backdrop-blur-sm
        transition-colors duration-200
        ${isDark 
          ? 'bg-bnet-gray-700/50 border-bnet-gray-600 shadow-lg shadow-black/10' 
          : 'bg-bnet-gray-50 border-bnet-gray-200 shadow-lg shadow-bnet-gray-200/50'
        }
      `}>
        <h2 className={`
          text-2xl font-semibold mb-4 tracking-tight
          ${isDark ? 'text-bnet-gray-100' : 'text-bnet-gray-900'}
        `}>
          Getting Started
        </h2>
        <p className={`
          max-w-2xl mx-auto
          ${isDark ? 'text-bnet-gray-400' : 'text-bnet-gray-600'}
        `}>
          Install the SimulationCraft addon in-game, type /simc to get your character data, 
          and paste it into any of our tools to start optimizing your character.
        </p>
      </div>
    </div>
  );
}; 