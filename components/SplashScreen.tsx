'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // إخفاء بعد 3 ثوانٍ كحد أقصى
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="text-center max-w-md px-4">
        {/* الأيقونة الكبيرة */}
        <div className="mb-8">
          <div className="w-64 h-64 md:w-80 md:h-80 mx-auto relative">
            {/* أيقونة SVG كبيرة */}
            <svg 
              className="w-full h-full text-primary-600 animate-float"
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M4 17.5V19.5H7V17.5H4M19 17.5V19.5H22V17.5H19M10 6.12C10.58 5.7 11.26 5.5 12 5.5C13.2 5.5 14.27 6.06 15 7L18 4.5H14.5V2.5H21.5V9.5H19.5V6L16.5 8.5C15.73 7.67 14.75 7.1 13.66 6.88L20 13.23V16.5H18V14.5L12.45 9H9.55L4.31 14.23C3.5 14.65 3 15.5 3 16.5V17.5H7V22H9V17.5H15V22H17V17.5H21V16.5C21 15.4 20.55 14.45 19.83 13.83L10 6.12Z"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-5xl">🚜</span>
            </div>
          </div>
        </div>
        
        {/* العنوان الكبير */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          رفيق المزارع
        </h1>
        
        {/* الوصف */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          محاسب التراكتور الزراعي
        </p>
        
        {/* مؤشر التحميل */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-gray-500 mt-4 animate-pulse">جاري تحميل التطبيق...</p>
      </div>
    </div>
  );
}
