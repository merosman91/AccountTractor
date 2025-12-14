'use client';

import { useState, useEffect } from 'react';
import { FaTractor, FaChartBar, FaDatabase, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-gradient-to-r from-white to-gray-50 border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group hover:shadow-xl transition-all duration-300">
                <div className="text-white text-3xl group-hover:scale-110 transition-transform">
                  🚜
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                محاسب التراكتور
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1 hidden md:block">
                نظام محاسبة متكامل - يعمل دون إنترنت
              </p>
            </div>
          </div>

          {/* قائمة الهاتف */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600 transition"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* الأزرار الرئيسية */}
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => window.location.hash = '#reports'}
              className="btn-gradient flex items-center gap-2 px-5 py-3"
            >
              <FaChartBar />
              <span>التقارير</span>
            </button>
            <button 
              onClick={() => window.location.hash = '#backup'}
              className="btn-outline flex items-center gap-2 px-5 py-3"
            >
              <FaDatabase />
              <span>النسخ الاحتياطي</span>
            </button>
          </div>
        </div>

        {/* قائمة الهاتف المنبثقة */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 animate-slide-down">
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <tab.icon className="text-primary-600" />
                  <span className="font-medium">{tab.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* تبويبات التنقل */}
        <nav className="hidden md:block mt-6">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="tab-modern flex items-center gap-2 flex-1 justify-center"
              >
                <tab.icon className="text-lg" />
                {tab.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
      }
