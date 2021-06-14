const path = require('path')
const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(
  commonConfiguration,
  {
    mode: 'production',
    output: {
      path: path.resolve(__dirname, '../docs/camera-on-path'),
    },
    plugins: [new CleanWebpackPlugin()],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
  }
)
