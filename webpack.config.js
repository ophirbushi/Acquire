var webpack = require('webpack'),
    path = require('path'),
    TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

module.exports = {
    context: __dirname,
    entry: "./src/main",
    output: {
        path: "./dist",
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['.js', '.ts'],
        modules: [
            path.resolve('./src'),
            'node_modules'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new TsConfigPathsPlugin()
    ]
};