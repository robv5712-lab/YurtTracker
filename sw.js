var CACHE = "park-tracker-v3";
var ASSETS = [".", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).catch(function(){
        if(req.mode === "navigate") return caches.match("index.html");
      });
    })
  );
});
