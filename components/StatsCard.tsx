'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'green' | 'orange' | 'blue' | 'red' | 'purple';
  subtitle?: string;
  format?: (value: number) => string;
}

const colorClasses = {
  green: 'border-green-500 bg-green-50',
  orange: 'border-orange-500 bg-orange-50',
  blue: 'border-blue-500 bg-blue-50',
  red: 'border-red-500 bg-red-50',
  purple: 'border-purple-500 bg-purple-50',
};

const iconColors = {
  green: 'text-green-600',
  orange: 'text-orange-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
};

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle = "جنيه",
  format = (val) => val.toLocaleString()
}: StatsCardProps) {
  return (
    <div className={`stats-card ${colorClasses[color]} group`}>
      <div className="flex flex-col items-center">
        <div className={`text-3xl mb-4 ${iconColors[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-gray-600 text-sm mb-2">{title}</div>
        <div className={`text-4xl md:text-5xl font-bold ${
          color === 'green' ? 'text-green-600' :
          color === 'orange' ? 'text-orange-600' :
          color === 'blue' ? 'text-blue-600' :
          color === 'red' ? 'text-red-600' :
          'text-purple-600'
        }`}>
          {format(value)}
        </div>
        <div className="text-gray-500 text-sm mt-2">{subtitle}</div>
      </div>
    </div>
  );
}
