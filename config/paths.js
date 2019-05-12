const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPublic: resolveApp("public"),
  nodeModules: resolveApp("node_modules"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appIndex: resolveApp("src/index.js"),
  rootDir: resolveApp("."),
  // Configs
  eslintDevConfig: resolveApp("config/eslint/eslint.config.babel.dev.js"),
  styleLintConfig: resolveApp("./stylelint.config.js"),
  prettierConfig: resolveApp("config/prettier/prettier.config.babel.js"),
  jestConfig: resolveApp("config/jest"),
  postCssConfig: resolveApp("config/postcss"),
  // Resolve aliases for imports (defined in webpack config)
  modulesPath: resolveApp("src/modules"),
  stylesPath: resolveApp("src/styles")
};
