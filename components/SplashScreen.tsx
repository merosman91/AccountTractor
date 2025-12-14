'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    'جاري تحميل التطبيق...',
    'تهيئة قاعدة البيانات...',
    'تحضير التقارير...',
    'جاهز للعمل!',
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);

    // إخفاء بعد 5 ثوانٍ كحد أقصى
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(textTimer);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-primary-50 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="text-center max-w-md px-4">
        {/* الأيقونة المتحركة */}
        <div className="mb-10">
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto">
              {/* دوائر متحركة */}
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-ping"></div>
              <div className="absolute inset-4 border-4 border-primary-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-8 border-4 border-primary-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              
              {/* أيقونة الجرار */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                  <span className="text-5xl md:text-6xl">🚜</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* العنوان */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          رفيق المزارع
        </h1>
        
        {/* الوصف */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          محاسب التراكتور الزراعي
        </p>
        
        {/* شريط التقدم */}
        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto mb-4 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300 shadow-md"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* النص المتحرك */}
        <p className="text-gray-500 mb-2 h-6">
          {loadingTexts[textIndex]}
        </p>
        
        {/* النسبة المئوية */}
        <p className="text-primary-600 font-bold text-lg">
          {progress}%
        </p>
        
        {/* شعار صغير */}
        <div className="mt-12 text-gray-400 text-sm">
          مجهز ب❤️️ للمزارعين وسائقي التراكتور
        </div>
      </div>
    </div>
  );
                               }
