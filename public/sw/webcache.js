const cacheName = 'v1'

const contentToCache = [
  '/',
  '/index.html',
  '/sw/db.js',
  '/sw/http.js',
  '/sw/webcache.js',
  '/images/48.png',
  '/images/72.png',
  '/images/96.png',
  '/images/144.png',
  '/images/192.png',
  '/images/512.png'
]

this.addEventListener('install', (e) => {
  console.log('ServiceWorker installing')
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(contentToCache)
    })
  )
})