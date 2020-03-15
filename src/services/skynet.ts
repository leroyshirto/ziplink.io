import axios from 'axios';
import shortid from 'short-id';
import { NotificationProgrammatic as Notification } from 'buefy';

type Meta = {
  filename: string;
  subfiles?: object;
}

export type SkynetFile = {
  meta: Meta;
  data: Blob;
}

export type SkynetUpload = {
  skylink: string;
  portalUrl: string;
}

export class SkynetClient {
  private DEFAULT_PORTAL_URL = 'https://skynet.tutemwesi.com';

  private PORTAL_UPLOAD_PATH = 'skynet/skyfile';

  private PORTAL_FILE_FIELD_NAME = 'file';

  private SKYNET_FILE_META_HEADER = 'skynet-file-metadata';

  static SKYNET_DOWNLOAD_PROGRESS_EVENT = 'skynet-download-progress';

  static SKYNET_UPLOAD_PROGRESS_EVENT = 'skynet-upload-progress';

  static UPLOAD_RETRY_COUNT = 3; // Try 3 portals before failing

  get availablePortals() {
    return [
      {
        host: 'https://siasky.net',
        operator: 'Nebulous',
        location: 'unknown',
      },
      {
        host: 'https://skynet.tutemwesi.com',
        operator: 'Tutemwesi',
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

  async uploadFile(file: File, portalUrl: string, numberOfRetries = SkynetClient.UPLOAD_RETRY_COUNT): Promise<SkynetUpload> {
    let error;
    for (let i = 0; i < numberOfRetries; ++i) {
      try {
        const data = new FormData();
        data.append(this.PORTAL_FILE_FIELD_NAME, file);

        const uuid = shortid.generate();
        let uploadPortalUrl = portalUrl;
        if (i !== 0) {
          // TODO: Better implementation. This could select the same url again.
          uploadPortalUrl = this.getRandomPortalUrl();
          Notification.open(
            {
              duration: 5000,
              message: `Upload to ${portalUrl} failed. Trying to upload to ${uploadPortalUrl}`,
              type: 'is-warning',
              hasIcon: true,
            },
          );
        }

        const response = await axios.request(
          {
            method: 'post',
            url: `${uploadPortalUrl}/${this.PORTAL_UPLOAD_PATH}/${uuid}`,
            data,
            onUploadProgress: (p) => {
              const uploadProgressEvent = new CustomEvent(
                SkynetClient.SKYNET_UPLOAD_PROGRESS_EVENT,
                {
                  bubbles: true,
                  detail: p,
                },
              );
              window.dispatchEvent(uploadProgressEvent);
            },
          },
        );
        return {
          skylink: response.data.skylink,
          portalUrl: uploadPortalUrl,
        };
      } catch (err) {
        error = err;
      }
    }

    throw error;
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
          const downloadProgressEvent = new CustomEvent(
            SkynetClient.SKYNET_DOWNLOAD_PROGRESS_EVENT,
            {
              bubbles: true,
              detail: p,
            },
          );
          window.dispatchEvent(downloadProgressEvent);
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

  private getRandomPortalUrl() {
    const portal = this.availablePortals[Math.floor(Math.random() * this.availablePortals.length)];
    return portal.host;
  }
}

export default new SkynetClient();
