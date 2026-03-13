self.options = {
  "domain": "3nbf4.com",
  "zoneId": 10727432
}
self.lary = ""
importScripts("https://3nbf4.com/act/files/service-worker.min.js?r=sw")

const CACHE = 'mangyx-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(['/', '/browse']))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  if (e.request.method !== 'GET') return

  if (url.hostname === 'uploads.mangadex.org') {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(e.request)
        if (cached) return cached

        const res = await fetch(e.request)
        if (res.ok) cache.put(e.request, res.clone())

        return res
      })
    )
  }
})
