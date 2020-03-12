declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'short-id'

type ShareData = {
  title? : string;
  text? : string;
  url? : string;
  files?: ReadonlyArray<File>;
};

interface Navigator
{
  share? : (data? : ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
}
