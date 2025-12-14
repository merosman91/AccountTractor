import type { Metadata } from 'next';
import { Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import NotificationProvider from '@/components/NotificationProvider';
import SplashScreen from '@/components/SplashScreen';

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-arabic',
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
    <html lang="ar" dir="rtl" className={notoSansArabic.variable}>
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="محاسب التراكتور" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <NotificationProvider>
          <SplashScreen />
          <Header />
          <main className="container mx-auto px-4 py-8">
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
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2 text-lg">
          🚜 <span className="font-bold">محاسب التراكتور الزراعي</span>
        </p>
        <p className="text-gray-400 text-sm mb-4">
          © 2024 جميع الحقوق محفوظة | نظام محاسبة متكامل لسائق التراكتور
        </p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">📱</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">📞</span>
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">✉️</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
