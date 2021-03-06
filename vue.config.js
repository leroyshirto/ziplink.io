/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  productionSourceMap: false,
  chainWebpack: (config) => config.optimization.minimize(false),
  pwa: {
    name: 'Ziplink.io',
    themeColor: '#23c0cf',
    msTileColor: '#2c363e',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/sw/service-worker.js',
      exclude: '_redirects',
    },
    manifestOptions: {
      short_name: 'Ziplink',
      background_color: '#254C4F',
      display: 'standalone',
      orientation: 'portrait',
      start_url: './',
      share_target: {
        action: './?upload',
        method: 'POST',
        enctype: 'multipart/form-data',
        params: {
          files: [
            {
              name: 'file',
              accept: [
                '*/*',
              ],
            },
          ],
        },
      },
    },
  },
};
