const CACHE="cadeteria-v3";
const APP="./app.html";

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(c=>
      c.addAll([
        APP,
        "./manifest.json"
      ])
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys
          .filter(key=>key!==CACHE)
          .map(key=>caches.delete(key))
      )
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{

  if(event.request.method!=="GET")
    return;

  event.respondWith(
    fetch(event.request)
      .catch(()=>caches.match(event.request))
  );

});


/* =========================
   NOTIFICACIONES PUSH
========================= */

self.addEventListener("push",event=>{

  let data={};

  try{
    data=event.data ? event.data.json() : {};
  }catch(e){
    data={
      title:"🛵 NUEVO PEDIDO",
      body:event.data ? event.data.text() : "Hay un nuevo pedido."
    };
  }

  const title=
    data.title ||
    "🛵 NUEVO PEDIDO";

  const options={
    body:
      data.body ||
      "Hay un nuevo pedido.",

    icon:"./icono-192.png",

    badge:"./icono-192.png",

    vibrate:[
      200,
      100,
      200,
      100,
      400
    ],

    data:{
      url:
        data.url ||
        "./app.html"
    },

    tag:"nuevo-pedido",

    renotify:true
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );

});


/* =========================
   AL TOCAR NOTIFICACIÓN
========================= */

self.addEventListener(
  "notificationclick",
  event=>{

    event.notification.close();

    const url=
      event.notification.data &&
      event.notification.data.url
        ? event.notification.data.url
        : "./app.html";

    event.waitUntil(

      clients.matchAll({
        type:"window",
        includeUncontrolled:true
      }).then(windowClients=>{

        for(const client of windowClients){

          if("focus" in client){

            client.navigate(url);
            return client.focus();

          }

        }

        if(clients.openWindow)
          return clients.openWindow(url);

      })

    );

  }
);
