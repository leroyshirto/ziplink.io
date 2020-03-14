import shortid from 'short-id';
import { SkynetUpload } from '@/services/skynet';

export enum LinkType {
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
}

export default class LinkHistoryItem {
  uuid: string;

  skylink: string;

  portalUrl: string;

  linkType: LinkType;

  createdAt: string;

  constructor(skylink: string, portalUrl: string, linkType: LinkType) {
    this.uuid = shortid.generate();
    this.skylink = skylink;
    this.portalUrl = portalUrl;
    this.linkType = linkType;
    this.createdAt = new Date().toUTCString();
  }

  public static createForUpload(skynetUpload: SkynetUpload) {
    return new LinkHistoryItem(skynetUpload.skylink, skynetUpload.portalUrl, LinkType.UPLOAD);
  }

  public static createForDownload(skylink: string, portalUrl: string) {
    return new LinkHistoryItem(skylink, portalUrl, LinkType.DOWNLOAD);
  }
}
