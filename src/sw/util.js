
// eslint-disable-next-line import/prefer-default-export
export function serveShareTarget(event) {
  const dataPromise = event.request.formData();

  // Redirect so the user can refresh the page without resending data.
  event.respondWith(Response.redirect('/#/?upload'));

  event.waitUntil(async function () {
    // The page sends this message to tell the service worker it's ready to receive the file.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await nextMessage('share-ready');
    // eslint-disable-next-line no-restricted-globals
    const client = await self.clients.get(event.resultingClientId);
    const data = await dataPromise;
    const file = data.get('file');
    client.postMessage({ file, action: 'load-image' });
  }());
}

const nextMessageResolveMap = {};

/**
 * Wait on a message with a particular event.data value.
 *
 * @param dataVal The event.data value.
 */
function nextMessage(dataVal) {
  return new Promise((resolve) => {
    if (!nextMessageResolveMap.has(dataVal)) {
      nextMessageResolveMap.set(dataVal, []);
    }
    // eslint-disable-next-line no-unused-expressions
    nextMessageResolveMap.get(dataVal)?.push(resolve);
  });
}
