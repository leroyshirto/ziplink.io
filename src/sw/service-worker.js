/* eslint-disable no-restricted-globals,no-underscore-dangle */
/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
// eslint-disable-next-line no-undef
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// Utils
const nextMessageResolveMap = {};

/**
 * Wait on a message with a particular event.data value.
 *
 * @param dataVal The event.data value.
 */
function nextMessage(dataVal) {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!nextMessageResolveMap.hasOwnProperty(dataVal)) {
      nextMessageResolveMap[dataVal] = [];
    }
    // eslint-disable-next-line no-unused-expressions
    nextMessageResolveMap[dataVal]?.push(resolve);
  });
}

self.addEventListener('message', (event) => {
  const resolvers = nextMessageResolveMap[event.data];
  if (resolvers === undefined) return;
  if (!resolvers) return;
  delete nextMessageResolveMap[event.data];
  // eslint-disable-next-line no-restricted-syntax
  for (const resolve of resolvers) resolve();
});

function serveShareTarget(event) {
  // Redirect so the user can refresh the page without resending data.
  event.respondWith(Response.redirect('/?upload'));

  event.waitUntil(async function () {
    const data = await event.request.formData();
    const file = data.get('file');

    // Wait for a client to say they are ready
    await nextMessage('share-ready');

    const channel = new BroadcastChannel('sw-messages');
    channel.postMessage({ file, action: 'load-file' });
  }());
}

self.addEventListener('activate', () => {
  // eslint-disable-next-line no-undef
  self.clients.claim();
});

// Install new service worker when ok then reload the page
self.addEventListener('message', (msg) => {
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Handle web share
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't care about other-origin URLs
  if (url.origin !== location.origin) return;

  if (
    url.pathname === '/'
    && url.searchParams.has('upload')
    && event.request.method === 'POST'
  ) {
    serveShareTarget(event);
  }
  console.log(url.pathname);
});
