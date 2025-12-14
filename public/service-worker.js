// اسم التطبيق
const APP_NAME = 'محاسب التراكتور';
const APP_VERSION = '1.0.0';

// الملفات التي يتم تخزينها مؤقتاً
const CACHE_NAME = `tractor-accountant-${APP_VERSION}`;
const FILES_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // سيتم إضافة الملفات الأخرى أثناء البناء
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('جارٍ تخزين الملفات في الذاكرة المؤقتة...');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('تم التثبيت بنجاح');
        return self.skipWaiting();
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('جارٍ حذف الذاكرة المؤقتة القديمة:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('تم التفعيل بنجاح');
      return self.clients.claim();
    })
  );
});

// معالجة الطلبات
self.addEventListener('fetch', (event) => {
  // تخطي طلبات POST
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا كان الملف موجوداً في الذاكرة المؤقتة
        if (response) {
          return response;
        }

        // إذا لم يكن موجوداً، حمله من الشبكة
        return fetch(event.request)
          .then((response) => {
            // التحقق من أن الرد صالح
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // نسخ الرد إلى الذاكرة المؤقتة
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // إذا فشل التحميل من الشبكة
            return caches.match('/')
              .then((response) => response || new Response('لا يوجد اتصال بالإنترنت'));
          });
      })
  );
});

// معالجة رسائل push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'إشعار من محاسب التراكتور',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'محاسب التراكتور', options)
  );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// تحديث الخلفية
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('مزامنة البيانات في الخلفية...');
  }
});
