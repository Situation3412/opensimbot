import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { Card } from './ui/Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  link
}) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  return (
    <Link to={link} className="block">
      <Card className={`
        h-full transition-transform duration-200 hover:-translate-y-1
        ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
      `}>
        <Card.Body>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`
              p-2 rounded-lg
              ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'}
            `}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {description}
          </p>
        </Card.Body>
      </Card>
    </Link>
  );
}; 