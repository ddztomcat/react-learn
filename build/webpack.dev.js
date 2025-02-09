// webpack.dev.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const getPort = require('get-port')
// 合并公共配置，并添加开发环境配置
module.exports = () => getPort().then(port => {
  return merge(baseConfig, {
    mode: 'development', // 开发模式，不会压缩最终代码
    devServer: {
      open: true,
      port: 64610, // 服务端口号
      compress: false, // gzip压缩，开发环境不开启，提升速度
      // 解决路由跳转404问题
      historyApiFallback: true,
      hot: true,
      static: { //托管静态资源文件
        directory: path.join(__dirname, "../public"),
      },
      proxy: {
        '/fs': {
          target: 'http://localhost:9000',
        }
      },
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
      // 开启react模块热替换插件
      new ReactRefreshWebpackPlugin(),
    ]
  })
})