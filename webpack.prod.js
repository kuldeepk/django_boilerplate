const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const BundleTracker = require("webpack-bundle-tracker");
const { CheckerPlugin } = require("awesome-typescript-loader");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [
	new BundleTracker({ filename: "./webpack-stats.json" }),
	new CheckerPlugin(),
	new BundleAnalyzerPlugin({
		analyzerMode: 'static'
	})
];

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve("./static/webpack_bundles/"),
		filename: "[name]-[hash].js",
		chunkFilename: '[name].chunk.js',
		publicPath: 'https://cdn.getsliver.com/static/webpack_bundles/'
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			parallel: true,
			terserOptions: {
	          ecma: 6,
	          warnings: true,
	          ie8: false
	        },
		})],
	},
	plugins
});