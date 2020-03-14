import axios from 'axios';
import shortid from 'short-id';

type Meta = {
  filename: string;
  subfiles?: object;
}

export type SkynetFile = {
  meta: Meta;
  data: Blob;
}

export class SkynetClient {
  private DEFAULT_PORTAL_URL = 'https://skynet.tutemwesi.com';

  private PORTAL_UPLOAD_PATH = 'skynet/skyfile';

  private PORTAL_FILE_FIELD_NAME = 'file';

  private SKYNET_FILE_META_HEADER = 'skynet-file-metadata';

  static SKYNET_DOWNLOAD_PROGRESS_EVENT = 'skynet-download-progress';

  get availablePortals() {
    return [
      {
        host: 'https://siasky.net',
        operator: 'Nebulous',
        location: 'unknown',
      },
      {
        host: 'https://skydrain.net',
        operator: 'PixelDrain',
        location: 'unknown',
      },
      {
        host: 'https://sialoop.net',
        operator: 'Keops',
        location: 'unknown',
      },
      {
        host: 'https://siacdn.com',
        operator: 'Maxint LLC',
        location: 'unknown',
      },
      {
        host: 'https://skynethub.io',
        operator: 'jchauan',
        location: 'unknown',
      },
      {
        host: 'https://skynet.luxor.tech',
        operator: 'Luxor',
        location: 'unknown',
      },
      {
        host: 'https://skynet.tutemwesi.com',
        operator: 'Tutemwesi',
        location: 'unknown',
      },
      {
        host: 'https://vault.lightspeedhosting.com',
        operator: 'Lightspeed Hosting',
        location: 'unknown',
      },
      {
        host: 'https://broken.example.com',
        operator: 'Known Broken Portal',
        location: 'unknown',
      },
    ];
  }

  get defaultPortalUrl() {
    return this.DEFAULT_PORTAL_URL;
  }

  async uploadFile(file: File, portalUrl: string) {
    const data = new FormData();
    data.append(this.PORTAL_FILE_FIELD_NAME, file);

    const uuid = shortid.generate();
    const response = await fetch(
      `${portalUrl}/${this.PORTAL_UPLOAD_PATH}/${uuid}`,
      { method: 'POST', body: data },
    );

    // const response = await axios.request(
    //   {
    //     method: 'post',
    //     url: `${this.PORTAL_URL}/${this.PORTAL_UPLOAD_PATH}/${uuid}`,
    //     data,
    //     onUploadProgress: (p) => {
    //       console.log(p);
    //     },
    //   },
    // );

    return response.json();
  }

  async fetchLink(skylink: string, portalUrl: string) {
    const response = await axios.request(
      {
        method: 'get',
        url: `${portalUrl}/${skylink}`,
        headers: { Range: 'bytes=0-0' }, // We only want the response header
        responseType: 'blob', // important
      },
    );

    return response.data;
  }

  async downloadFile(skylink: string, portalUrl: string) {
    const response = await axios.request(
      {
        method: 'get',
        url: `${portalUrl}/${skylink}`,
        responseType: 'blob', // important
        onDownloadProgress: (p: ProgressEvent) => {
          const eventAwesome = new CustomEvent(SkynetClient.SKYNET_DOWNLOAD_PROGRESS_EVENT, {
            bubbles: true,
            detail: p,
          });
          window.dispatchEvent(eventAwesome);
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    if (!response.headers[this.SKYNET_FILE_META_HEADER]) {
      throw new Error('Could not get the links meta data');
    }

    // Looks like this {"filename":"test.html"}
    const meta = JSON.parse(response.headers['skynet-file-metadata'] as string);
    const data = await response.data;

    return { meta, data };
  }
}

export default new SkynetClient();
