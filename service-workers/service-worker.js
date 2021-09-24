self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v2').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './css/style.css',
        './js/app.js',
        './img/fallback.jpg',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Активирован');
});

async function cachePriorityStrategy(event) {
  const cacheResponse = await caches.match(event.request);

  if (cacheResponse) {
    return cacheResponse;
  }

  const fetchResponse = await fetch(event.request);

  const cache = await caches.open('v2');

  cache.put(event.request, fetchResponse.clone());

  return fetchResponse;
}

async function imageCachePriorityStrategy(event) {
  const cacheResponse = await caches.match(event.request);

  if (cacheResponse) {
    return cacheResponse;
  }

  let fetchResponse;

  try {
    fetchResponse = await fetch(event.request);
  } catch (error) {

  }

  if (fetchResponse) {
    const cache = await caches.open('v2');

    cache.put(event.request, fetchResponse.clone());

    return fetchResponse;
  }

  return await caches.match('./img/fallback.jpg');
}

async function httpPriorityStrategy(event) {
  let fetchResponse;

  try {
    fetchResponse = await fetch(event.request);
  } catch (error) {

  }

  if (fetchResponse) {
    const cache = await caches.open('v2');

    cache.put(event.request, fetchResponse.clone());

    return fetchResponse;
  }

  const cacheResponse = await caches.match(event.request);

  return cacheResponse;
}

self.addEventListener('fetch', (event) => {
  console.log(event.request);

  const url = new URL(event.request.url);

  const path = url.pathname;

  if (path.startsWith('/css')) {
    event.respondWith(
      cachePriorityStrategy(event)
    );

    return;
  }

  if (path.startsWith('/img/user')) {
    event.respondWith(
      imageCachePriorityStrategy(event)
    );

    return;
  }

  event.respondWith(
    httpPriorityStrategy(event)
  );

  console.log('Происходит запрос на сервер');
});
