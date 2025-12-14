import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import NotificationProvider from '@/components/NotificationProvider';
import SplashScreen from '@/components/SplashScreen';

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'رفيق المزارع - محاسب التراكتور الزراعي',
  description: 'نظام محاسبة متكامل لسائق التراكتور الزراعي، يدعم العمل دون إنترنت',
  keywords: ['تراكتور', 'زراعة', 'محاسبة', 'مزارع', 'سائق', 'حسابات'],
  authors: [{ name: 'رفيق المزارع' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#2E7D32',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} scroll-smooth`}>
      <head>
        {/* أيقونة SVG بدلاً من PNG */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚜</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚜</text></svg>" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="محاسب التراكتور" />
        {/* تحسين PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2E7D32" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* تأثير خلفي احترافي */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <NotificationProvider>
          <SplashScreen />
          <Header />
          <main className="container mx-auto px-4 py-8 relative">
            {children}
          </main>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-800 to-gray-900 text-white py-12 mt-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                محاسب التراكتور
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              نظام محاسبة متكامل ومتخصص لسائقي التراكتور الزراعي.
              صمم خصيصاً لتنظيم الحسابات وتتبع المصاريف بكل سهولة.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#work" className="text-gray-300 hover:text-white transition">أعمال الميدان</a></li>
              <li><a href="#expenses" className="text-gray-300 hover:text-white transition">المصاريف</a></li>
              <li><a href="#clients" className="text-gray-300 hover:text-white transition">الزبائن</a></li>
              <li><a href="#reports" className="text-gray-300 hover:text-white transition">التقارير</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <span className="ml-2">📧</span>
                <span>support@tractor-accountant.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="ml-2">📱</span>
                <span>+20 123 456 7890</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                📱
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                📞
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                ✉️
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} رفيق المزارع - محاسب التراكتور الزراعي. جميع الحقوق محفوظة.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            مصمم ب❤️️ للمزارعين وسائقي التراكتور
          </p>
        </div>
      </div>
    </footer>
  );
      }
