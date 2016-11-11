var path = require('path');
var webpack = require('webpack');
var debug = process.env.NODE_ENV !== "production";

module.exports = {
	context: __dirname,
	devtool: debug ? "inline-sourcemap" : null,
	entry: './src/script.js',
	output: { path: __dirname + '/public/', filename: 'bundle.js' },
	watch: false,
	resolve: {
		extensions: [ '', '.js', '.pug' ]
	},
	plugins: debug ? [] : [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
	],
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /.sass$/,
				loaders: ['style', 'css', 'sass']
			}
		]
	}
};
