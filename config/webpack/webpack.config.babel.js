// @flow
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import StyleLintPlugin from "stylelint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "fs";
import GitRevisionPlugin from "git-revision-webpack-plugin";
import Dotenv from "dotenv-webpack";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import paths from "../paths";
import {
  aliases,
  sassRegex,
  jsRegex,
  fileRegex,
  sassModuleRegex
} from "./shared.config.babel.js";

// Revision plugin
const versionPlugin = new GitRevisionPlugin();

// Exctract Text SCSS
const extractStyles = new MiniCssExtractPlugin({
  filename: "[name].[hash].bundle.css"
});

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
    loader: mode !== "production" ? "css-loader" : MiniCssExtractPlugin.loader,
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
    entry: paths.appIndex,
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
      filename: "[name].[hash].bundle.js"
    },
    plugins: [styleLintPlugin, extractStyles, htmlWebpackPlugin, dotEnvPlugin],
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
