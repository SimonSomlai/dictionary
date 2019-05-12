import paths from "../paths";

export const aliases = {
  "@modules": paths.modulesPath,
  "@styles": paths.stylesPath,
  "@src": paths.appSrc
};

export const cssRegex = /\.css$/;
export const cssModuleRegex = /\.module\.css$/;
export const sassRegex = /\.scss$/;
export const sassModuleRegex = /\.module\.scss$/;
export const jsRegex = /\.(js|mjs|jsx)$/;
export const fileRegex = /\.(jpe?g|png|gif|ico|svg|otf|eot|woff|woff2|ttf)$/i;
