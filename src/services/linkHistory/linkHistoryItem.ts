import shortid from 'short-id';

export enum LinkType {
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
}

export default class LinkHistoryItem {
  uuid: string;

  skylink: string;

  linkType: LinkType;

  createdAt: string;

  constructor(skylink: string, linkType: LinkType) {
    this.uuid = shortid.generate();
    this.skylink = skylink;
    this.linkType = linkType;
    this.createdAt = new Date().toUTCString();
  }

  public static createForUpload(skylink: string) {
    return new LinkHistoryItem(skylink, LinkType.UPLOAD);
  }

  public static createForDownload(skylink: string) {
    return new LinkHistoryItem(skylink, LinkType.DOWNLOAD);
  }
}
