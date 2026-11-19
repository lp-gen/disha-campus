const C = 'disha-v2';
const FILES = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
const fallback = req => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const net = Promise.race([fetch(e.request), new Promise((_, rej) => setTimeout(rej, 4000))]);
  e.respondWith(net.then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; }).catch(() => fallback(e.request)));
});
