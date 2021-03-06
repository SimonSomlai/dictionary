// @flow
import {
  aliases,
  fileRegex,
  jsRegex,
  sassModuleRegex,
  sassRegex
} from "./shared.config.babel.js";
import Dotenv from "dotenv-webpack";
import GitRevisionPlugin from "git-revision-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import StyleLintPlugin from "stylelint-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import paths from "../paths";

// Revision plugin
const versionPlugin = new GitRevisionPlugin();

// Style lint
const styleLintPlugin = new StyleLintPlugin({
  configFile: paths.styleLintConfig
});

// Secrets
const dotEnvPlugin = new Dotenv();

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: `${paths.appPublic}/index.html`
});

const getStyleLoader = (
  mode: string,
  modules: boolean = false
): Array<Object> => [
  {
    loader: "style-loader",
    query: {
      sourceMap: mode !== "production"
    }
  },
  {
    loader: "css-loader",
    query: {
      sourceMap: mode !== "production",
      url: true,
      modules,
      localIdentName: "[path][name]__[local]--[hash:base64:5]"
    }
  },
  "resolve-url-loader",
  {
    loader: "postcss-loader",
    query: {
      sourceMap: mode !== "production",
      config: {
        path: paths.postCssConfig
      }
    }
  },
  {
    loader: "sass-loader",
    query: {
      sourceMap: mode !== "production"
    }
  }
];

export default (_: *, { mode }: { mode: string } = {}): Object => {
  return {
    mode: mode || "development",
    context: paths.appSrc,
    entry: ["babel-polyfill", paths.appIndex],
    module: {
      rules: [
        // Javascripts
        {
          test: jsRegex,
          enforce: "pre",
          use: [
            {
              options: {
                eslintPath: require.resolve("eslint"),
                configFile: paths.eslintDevConfig
              },
              loader: require.resolve("eslint-loader")
            }
          ],
          include: paths.appSrc
        },
        {
          exclude: /node_modules/,
          test: jsRegex,
          loader: "babel-loader"
        },
        // GraphQL loader
        {
          test: /\.graphql$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader"
        },
        // Scss
        {
          test: sassModuleRegex,
          use: getStyleLoader(mode, true)
        },
        {
          test: sassRegex,
          use: getStyleLoader(mode, false),
          exclude: sassModuleRegex
        },
        // Image loader
        {
          test: fileRegex,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    },
    output: {
      path: paths.appDist,
      filename: "[name].[hash].bundle.js",
      publicPath: "/"
    },
    plugins: [styleLintPlugin, htmlWebpackPlugin, dotEnvPlugin],
    devtool: mode !== "production" ? "source-map" : false,
    devServer: {
      historyApiFallback: true
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: mode !== "production",
          parallel: true,
          sourceMap: mode !== "production" // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    // Resolve aliases
    resolve: {
      alias: {
        ...aliases
      }
    }
  };
};
