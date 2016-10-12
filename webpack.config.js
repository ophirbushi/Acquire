var webpack = require('webpack'),
    path = require('path');

module.exports = {
    context: __dirname,
    entry: "./build/main",
    output: {
        path: "./dist",
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.ts'],
        fallback: path.resolve(__dirname, 'build')
    }
};