const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const BundleTracker = require("webpack-bundle-tracker");
const { CheckerPlugin } = require("awesome-typescript-loader");

const plugins = [
  new BundleTracker({ filename: "./webpack-stats.json" }),
  new CheckerPlugin(),
  // new WebpackBuildNotifierPlugin({
  //   title: "Sliver: Webpack Build",
  //   logo: path.resolve("./static/images/sliver-logo-blue.png"),
  // })
];


module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
	},
	output: {
		path: path.resolve("./static/webpack_bundles/"),
		filename: "[name]-[hash].js",
		chunkFilename: '[name].chunk.js',
		publicPath: '/static/webpack_bundles/'
	},
	plugins
});