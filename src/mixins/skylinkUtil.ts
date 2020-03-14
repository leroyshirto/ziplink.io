import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SkylinkUtil extends Vue {
  public transferProgress = {
    timeStamp: 0,
    loaded: 0,
    total: 0,
    prevLoaded: 0,
    speed: 0,
  };

  humanFileSize(bytes: number, si = true) {
    let bytesToConvert = bytes;
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytesToConvert) < thresh) {
      return `${bytesToConvert} B`;
    }
    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
      bytesToConvert /= thresh;
      ++u;
    } while (Math.abs(bytesToConvert) >= thresh && u < units.length - 1);
    return `${bytesToConvert.toFixed(1)} ${units[u]}`;
  }

  getSkylinkUrl(skylink: string): string {
    const { port } = window.location;
    if (['80', '443', ''].includes(port)) {
      return `${window.location.protocol}//${window.location.hostname}/download/${skylink}`;
    }
    return `${window.location.protocol}//${window.location.hostname}:${port}/download/${skylink}`;
  }

  calculateSpeed() {
    if (this.transferProgress.timeStamp !== 0) {
      const time = Date.now() - this.transferProgress.timeStamp;
      const chunk = this.transferProgress.loaded - this.transferProgress.prevLoaded;
      this.transferProgress.speed = chunk / (time / 1000);
      this.transferProgress.timeStamp = Date.now();
      this.transferProgress.prevLoaded = this.transferProgress.loaded;
    } else {
      this.transferProgress.timeStamp = Date.now();
      this.transferProgress.prevLoaded = this.transferProgress.loaded;
    }
  }
}
