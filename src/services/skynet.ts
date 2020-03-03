import shortid from 'short-id';

class SkynetClient {
  private PORTAL_URL = 'https://skynet.tutemwesi.com';

  private PORTAL_UPLOAD_PATH = 'skynet/skyfile';

  private PORTAL_FILE_FIELD_NAME = 'file';

  async uploadFile(file: File) {
    console.debug('Upload File');

    try {
      const data = new FormData();
      data.append(this.PORTAL_FILE_FIELD_NAME, file);

      const uuid = shortid.generate();
      const response = await fetch(
        `${this.PORTAL_URL}/${this.PORTAL_UPLOAD_PATH}/${uuid}`,
        { method: 'POST', body: data },
      );

      return await response.json();
    } catch (error) {
      console.debug(file, 'error');

      throw error;
    }
  }

  async downloadFile(skylink: string) {
    // TODO: implement file download
    console.debug(`Download File from ${this.PORTAL_URL}`);
    return skylink;
  }
}

export default function getClient() {
  return new SkynetClient();
}
