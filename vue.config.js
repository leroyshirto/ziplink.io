/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  pwa: {
    name: 'Ziplink.io',
    themeColor: '#23c0cf',
    msTileColor: '#2c363e',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      short_name: 'Ziplink',
      background_color: '#2c363e',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
    },
  },
};
