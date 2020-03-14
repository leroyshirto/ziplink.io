/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { SnackbarProgrammatic as Snackbar } from 'buefy';

const notifyUserAboutAnUpdate = (worker: ServiceWorker | null) => {
  if (worker === null) {
    throw new Error('notifyUserAboutAnUpdate: Service worker was null');
  }

  Snackbar.open({
    message: 'A new version of Ziplink is available',
    actionText: 'Update',
    indefinite: true,
    onAction: () => {
      worker.postMessage({ action: 'skipWaiting' });
    },
  });
};

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n'
        + 'For more details, visit https://goo.gl/AFskqB',
      );
    },
    registered() {
      console.log('Service worker has been registered.');
      // This message is picked up by the service worker - it's how it knows we're ready to receive
      // the file.
      navigator.serviceWorker.controller!.postMessage('share-ready');
    },
    cached() {
      console.log('Content has been cached for offline use.');
      Snackbar.open('Ziplink has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated(registration: ServiceWorkerRegistration) {
      console.log('New content is available; please refresh.');
      notifyUserAboutAnUpdate(registration.waiting);
    },
    offline() {
      const message = 'No internet connection found. App is running in offline mode.';
      console.log(message);
      Snackbar.open(message);
    },
    error(error) {
      const message = `Error during service worker registration: ${error}`;
      console.error(message);
      Snackbar.open(message);
    },
  });

  let refreshing: boolean;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });

  navigator.serviceWorker.addEventListener('message', (event: any) => {
    Snackbar.open('Received Share target');
    if (event.data.action === 'load-file') {
      const webShareUploadEvent = new CustomEvent('ziplink-webshare',
        {
          bubbles: true,
          detail: { file: event.data.file },
        });
      window.dispatchEvent(webShareUploadEvent);
    }
  });
}
