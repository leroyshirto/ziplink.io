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
  private PORTAL_URL = 'https://skynet.tutemwesi.com';
  // private PORTAL_URL = 'https://siasky.net';

  private PORTAL_UPLOAD_PATH = 'skynet/skyfile';

  private PORTAL_FILE_FIELD_NAME = 'file';

  private SKYNET_FILE_META_HEADER = 'skynet-file-metadata';

  static SKYNET_DOWNLOAD_PROGRESS_EVENT = 'skynet-download-progress'

  async uploadFile(file: File) {
    const data = new FormData();
    data.append(this.PORTAL_FILE_FIELD_NAME, file);

    const uuid = shortid.generate();
    const response = await fetch(
      `${this.PORTAL_URL}/${this.PORTAL_UPLOAD_PATH}/${uuid}`,
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

  async downloadFile(skylink: string) {
    const response = await axios.request(
      {
        method: 'get',
        url: `${this.PORTAL_URL}/${skylink}`,
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

    // {"filename":"test.html"}
    const meta = JSON.parse(response.headers['skynet-file-metadata'] as string);
    const data = await response.data;

    return { meta, data };
  }
}

export default function client() {
  return new SkynetClient();
}
