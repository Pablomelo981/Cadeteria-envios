const CACHE="cadeteria-v2";
const APP="./app.html";
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll([APP,"./manifest.json"])));
  self.skipWaiting();
});
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
