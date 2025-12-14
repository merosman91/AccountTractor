'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: 'green' | 'orange' | 'blue' | 'red' | 'purple';
  subtitle?: string;
  trend?: number;
  format?: (value: number) => string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle = "جنيه",
  trend,
  format = (val) => val.toLocaleString()
}: StatsCardProps) {
  const colors = {
    green: 'from-emerald-500 to-green-500',
    orange: 'from-orange-500 to-amber-500',
    blue: 'from-blue-500 to-cyan-500',
    red: 'from-red-500 to-rose-500',
    purple: 'from-purple-500 to-pink-500',
  };

  const bgColors = {
    green: 'bg-gradient-to-br from-emerald-50 to-green-50',
    orange: 'bg-gradient-to-br from-orange-50 to-amber-50',
    blue: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    red: 'bg-gradient-to-br from-red-50 to-rose-50',
    purple: 'bg-gradient-to-br from-purple-50 to-pink-50',
  };

  return (
    <div className={`glass-card group relative overflow-hidden ${bgColors[color]}`}>
      {/* تأثير خلفي */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* نقطة زخرفية */}
      <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${colors[color]} opacity-10`}></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              trend >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <div className="text-gray-600 text-sm font-medium">{title}</div>
          <div className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
            {format(value)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-500 text-sm">{subtitle}</div>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-1000`}
              style={{ width: `${Math.min(100, (value / 10000) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
      }
