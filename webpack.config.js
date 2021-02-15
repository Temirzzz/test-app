const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'bundle.[chunkhash].js',
		path: path.resolve(__dirname, 'build')
	},
	devServer: {
		port: 5200
	},
	plugins: [
		new HTMLPlugin({
			template: './src/index.pug'
		}),
		new CleanWebpackPlugin(),
	],
	module: {
		rules: [
			{
			  test: /\.m?js$/,
			  exclude: /(node_modules)/
			},
			{
			  test: /\.css$/i,
			  use: 'css-loader',
			},
			{
			  test: /\.scss$/i,
			  use: [
				'css-loader', 
				'sass-loader'
			  ],
			},
			{
			  test: /\.pug$/,
			  loaders: [
				{
				  loader: "html-loader"
				},
				{
				  loader: "pug-html-loader",
				  options: {
					"pretty":true
				  }
				}
			]
		}]
  	},
}
