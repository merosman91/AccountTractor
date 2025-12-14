'use client';

import { useState, useEffect } from 'react';
import { FaTractor, FaChartBar, FaDatabase } from 'react-icons/fa';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'work', label: 'أعمال الميدان', icon: FaTractor },
    { id: 'expenses', label: 'المصاريف', icon: FaTractor },
    { id: 'clients', label: 'سجل الزبائن', icon: FaTractor },
    { id: 'reports', label: 'التقارير', icon: FaChartBar },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: FaDatabase },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white border-b-2 border-primary-600'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <FaTractor className="text-white text-3xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">🚜</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                محاسب التراكتور الزراعي
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                نظام محاسبة متكامل لسائق التراكتور - يدعم العمل دون إنترنت
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => window.location.hash = '#reports'}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <FaChartBar />
              <span className="hidden md:inline">التقارير</span>
            </button>
            <button 
              onClick={() => window.location.hash = '#backup'}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <FaDatabase />
              <span className="hidden md:inline">النسخ الاحتياطي</span>
            </button>
          </div>
        </div>

        {/* تبويبات التنقل */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium text-sm md:text-base whitespace-nowrap"
              >
                <tab.icon />
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
