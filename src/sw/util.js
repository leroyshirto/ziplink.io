
export function serveShareTarget(event) {
  const dataPromise = event.request.formData();

  // Redirect so the user can refresh the page without resending data.
  event.respondWith(Response.redirect('/#/?upload'));

  event.waitUntil(async function () {
    // The page sends this message to tell the service worker it's ready to receive the file.
    await nextMessage('share-ready');
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
    nextMessageResolveMap.get(dataVal)!.push(resolve);
  });
}
