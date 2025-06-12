self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    console.log('[Push] Received data:', data); // ✅ LOG

    // Make sure data contains expected fields:
    // title, body, image, icon, url, etc.

    const options = {
      body: data.body,
      icon: data.icon || 'https://protrack-eta.vercel.app/logo.png',
      badge: 'https://protrack-eta.vercel.app/logo.png',
      image: data.image,
      vibrate: [200, 100, 200],
      tag: data.tag || 'protrack-notification',
      renotify: true,
      requireInteraction: data.urgent || false,
      silent: data.silent || false,
      timestamp: Date.now(),
      actions: [
        {
          action: 'view',
          title: '👀 View',
          icon: '/icons/view-icon.png',
        },
        {
          action: 'dismiss',
          title: '❌ Dismiss',
          icon: '/icons/dismiss-icon.png',
        },
      ],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || '2',
        url: data.url || 'https://protrack-eta.vercel.app/u/',
        customData: data.customData || {},
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.warn('[Push] No data in push event');
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification?.data?.url || 'https://protrack-eta.vercel.app/u/';
  event.waitUntil(
    clients.openWindow(url)
  );
});
