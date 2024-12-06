const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config.js');
const setupProxy = require('./setupProxy');

const app = express();
const environment = process.env.DEV_ENV || 'local';
const config = webpackConfig({ environment });
const compiler = webpack(config);

const PORT = process.env.PORT || 3000;
const HOST = 'line-planet-call-local.lineplanet.me';

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: 'minimal'
    })
);

app.use(webpackHotMiddleware(compiler));

app.use(express.static(path.join(__dirname, 'public')));

// Apply setupProxy
setupProxy(app);

app.get('*', (req, res) => {
    console.log(`Request received for ${req.url}`);
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const https = require('https');
const selfsigned = require('selfsigned');

const attrs = [{ name: 'commonName', value: HOST }];
const pems = selfsigned.generate(attrs, { days: 365 });

const options = {
    key: pems.private,
    cert: pems.cert
};

https.createServer(options, app).listen(PORT, HOST, () => {
    console.log(`HTTPS Server is running on https://${HOST}:${PORT}`);
});
