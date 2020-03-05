import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SkylinkUtil extends Vue {
  getSkylinkUrl(skylink: string): string {
    const { port } = window.location;
    if (['80', '443', ''].includes(port)) {
      return `${window.location.protocol}//${window.location.hostname}#/download/${skylink}`;
    }
    return `${window.location.protocol}//${window.location.hostname}:${port}#/download/${skylink}`;
  }
}
