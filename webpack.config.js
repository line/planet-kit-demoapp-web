const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvWebpack = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
    const nodeEnv = process.env.NODE_ENV;
    const devEnv = process.env.DEV_ENV;
    const publicPath = '/';

    return {
        entry: devEnv !== 'local' ? './src/index.js' : ['webpack-hot-middleware/client?noInfo=true', './src/index.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'web-planet-kit-demo.js',
            publicPath: publicPath
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    type: 'asset/resource'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                inject: 'body'
            }),
            new DotenvWebpack({
                path: `./.env.${devEnv}`
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: './public/.htaccess', to: '.' },
                    { from: './public/favicon.ico', to: '.' }
                ]
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        mode: nodeEnv
    };
};
