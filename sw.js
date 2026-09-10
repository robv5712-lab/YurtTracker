var CACHE_PREFIX = "yurt-tracker-";
var CACHE = CACHE_PREFIX + "v7-site-92";
var ASSETS = [".", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k.indexOf(CACHE_PREFIX)===0 && k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  e.respondWith(
    caches.open(CACHE).then(function(cache){ return cache.match(req); }).then(function(hit){
      return hit || fetch(req).catch(function(){
        if(req.mode === "navigate") return caches.open(CACHE).then(function(cache){ return cache.match("index.html"); });
        return Response.error();
      });
    })
  );
});
