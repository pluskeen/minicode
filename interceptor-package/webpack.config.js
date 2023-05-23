const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const srcPath = path.join(__dirname, 'src')

module.exports = {
  mode: 'development',
  entry: path.join(srcPath, 'index.js'),
  devServer: {
    proxy: {
      // 将本地 /api/xxx 代理到 https://payne.cool/api/xxx
      '/api': {
        target: 'https://payne.cool',
        changeOrigin: true,
        // 将本地 /api2/xxx 代理到 https://payne.cool/xxx
        // pathRewrite: { '^/api': '' },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html'
    })
  ]
};

