/* eslint-disable no-restricted-globals,no-underscore-dangle */

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
// eslint-disable-next-line no-undef
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Install new service worker when ok then reload the page
self.addEventListener('message', (msg) => {
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Handle web share
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (
    url.origin === location.origin
    && url.pathname === '/#/?upload'
    && event.request.method === 'POST'
  ) {
    serveShareTarget(event);
  }
  console.log(url.pathname);
});
