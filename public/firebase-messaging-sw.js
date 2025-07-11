// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784",
  measurementId: "G-G4FRHCJEDP"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'SBS Travel Bildirim';
  const notificationOptions = {
    body: payload.notification?.body || 'Yeni bir bildirim aldınız',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.tag || 'sbs-travel',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'Görüntüle'
      },
      {
        action: 'close',
        title: 'Kapat'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});