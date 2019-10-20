const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  watch: true,
  mode: 'development',
  plugins: [
    new ExtensionReloader({
      reloadPage: true,
      entries: {
        contentScript: ['content_script', 'content_css'],
      }
    }),
  ]
});