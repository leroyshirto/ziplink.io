import shortid from 'short-id';

type Meta = {
  filename: string;
  subfiles?: object;
}

export type SkynetFile = {
  meta: Meta;
  data: Blob;
}

class SkynetClient {
  private PORTAL_URL = 'https://skynet.tutemwesi.com';
  // private PORTAL_URL = 'https://siasky.net';

  private PORTAL_UPLOAD_PATH = 'skynet/skyfile';

  private PORTAL_FILE_FIELD_NAME = 'file';

  private SKYNET_FILE_META_HEADER = 'skynet-file-metadata';

  async uploadFile(file: File) {
    const data = new FormData();
    data.append(this.PORTAL_FILE_FIELD_NAME, file);

    const uuid = shortid.generate();
    const response = await fetch(
      `${this.PORTAL_URL}/${this.PORTAL_UPLOAD_PATH}/${uuid}`,
      { method: 'POST', body: data },
    );

    return response.json();
  }

  async downloadFile(skylink: string) {
    const response = await fetch(`${this.PORTAL_URL}/${skylink}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (!response.headers.has(this.SKYNET_FILE_META_HEADER)) {
      throw new Error('Could not get the links meta data');
    }

    // {"filename":"test.html"}
    const meta = JSON.parse(response.headers.get('skynet-file-metadata') as string);
    const data = await response.blob();

    return { meta, data };
  }
}

export default function client() {
  return new SkynetClient();
}
