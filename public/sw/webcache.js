const cacheName = 'v1'

const contentToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/sw/db.js',
  '/sw/http.js',
  '/sw/webcache.js',
  '/images/48.png',
  '/images/72.png',
  '/images/96.png',
  '/images/144.png',
  '/images/192.png',
  '/images/512.png',

  'assets/axios.js',
  'assets/Login.js',
  'assets/ItemCard.js',
  'assets/List.js',
  'assets/Study.js',
  'assets/Review.js',
  'assets/New.js',
  'assets/List2.js',
  'assets/Settings.js',
  'assets/Login.css',
  'assets/ItemCard.css',
  'assets/Study.css',
  'assets/New.css',
  'assets/Review.css',
  'assets/index.css',
  'assets/index.js'
]

this.addEventListener('install', (e) => {
  console.log('[sw] installing')
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(contentToCache)
    })
  )
})