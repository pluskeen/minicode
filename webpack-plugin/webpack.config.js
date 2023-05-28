const VersionWebpackPlugin = require("./plugins/version-webpack-plugin");
const { DefinePlugin } = require('webpack');

const path = require("path");
const srcPath = path.join(__dirname, 'src')
const { version } = require(path.join(__dirname, './package.json'));

module.exports = {
  mode: 'production',
  entry: path.join(srcPath, 'index.js'),
  plugins: [
    // DefinePlugin 允许在 编译时 将你代码中的变量替换为其他值或表达式。
    new DefinePlugin({
      APP_VERSION: JSON.stringify(version),
    }),
    new VersionWebpackPlugin()
  ]
}
