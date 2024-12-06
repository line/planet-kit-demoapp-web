/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const http = require('http');
const https = require('https');
const express = require('express');
require('dotenv').config({ path: `./.env.${process.env.DEV_ENV}` });

function handleRequest(requestOptions) {
    return (req, res) => {
        const requestBody = req.body;

        let resData = '';
        requestOptions.path = req.originalUrl;
        requestOptions.method = req.method;
        if (req.header('Authorization')) requestOptions.headers.Authorization = req.header('Authorization');

        const protocol = requestOptions.port === 443 ? https : http;

        const postReq = protocol.request(requestOptions, (postRes) => {
            postRes.on('data', (chunk) => {
                resData += chunk;
            });

            postRes.on('end', () => {
                if (postRes.statusCode >= 400) {
                    try {
                        const jsonResponse = JSON.parse(resData);
                        res.status(postRes.statusCode).json(jsonResponse);
                    } catch (e) {
                        res.status(postRes.statusCode).json({
                            error: resData
                        });
                    }
                } else {
                    res.send(resData);
                }
            });
        });

        postReq.on('error', (err) => {
            console.error(err.message);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        });

        if (requestBody && req.method === 'POST') {
            postReq.write(JSON.stringify(requestBody));
        }

        postReq.end();
    };
}

module.exports = function (app) {
    app.use(express.json());
    app.use(
        ['/v2/register_user', '/v2/register_device', '/v2/access_token/issue'],
        handleRequest({
            host: process.env.REACT_APP_PROXY_AS_URI,
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
    );
};
