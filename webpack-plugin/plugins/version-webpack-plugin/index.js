// compiler 钩子，不同钩子调用的时机不同。
// https://webpack.docschina.org/api/compiler-hooks/
// 本插件使用 compilation 钩子，在 compilation 创建之后执行。

// 自定义插件指引
// https://webpack.docschina.org/contribute/writing-a-plugin/

const path = require('path')
const fs = require("fs");
// 获取当前执行时的目录
const root = process.cwd();
// 获取 package.json 文件
const {version} = require(path.join(path.join(root), 'package.json'));

module.exports = class VersionWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("VersionWebpackPlugin", compilation => {
      const outputPath = compilation.options.output.path
      const versionFile = outputPath + "/version.json"
      const content = `{"version": "${version}"}`

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, {recursive: true})
      }

      fs.writeFileSync(versionFile, content, {
        encoding: "utf8", flag: "w",
      })
    });
  }
}

