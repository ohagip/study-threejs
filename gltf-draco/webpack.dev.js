const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

module.exports = merge(
  commonConfiguration,
  {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      host: '0.0.0.0',
      useLocalIp: true,
      contentBase: './dist',
      watchContentBase: true,
      open: true,
    },
  }
)
