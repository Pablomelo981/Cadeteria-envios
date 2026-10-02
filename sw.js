const CACHE="cadeteria-v4";
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./app_actualizada.html","./manifest.json"])));
  self.skipWaiting();
});
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const url=(event.notification.data&&event.notification.data.url)||"./app_actualizada.html";
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    for(const client of list){
      if("focus" in client){client.navigate(url);return client.focus();}
    }
    if(clients.openWindow) return clients.openWindow(url);
  }));
});
