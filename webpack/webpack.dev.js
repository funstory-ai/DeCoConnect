const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtensionReloader = require('webpack-ext-reloader');

module.exports = merge(common, {
  entry:{
    content_css: './src/style/index.less',
  },
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