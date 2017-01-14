'use strict';

const http = require('http'),
    fs = require('fs'),
    express = require('express'),
    app = express(),
    server = http.Server(app),
    bodyParser = require('body-parser'),
    ExternalInterface = require('./controllers/ExternalInterface');

let apiRoutes = express.Router();
let externalInterface = new ExternalInterface(apiRoutes);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(apiRoutes);

externalInterface.registerRoutes();

app.listen(3003);

// Register to middleware
setTimeout(() => {
    let options = {
        hostname: 'middleware',
        port: 3001,
        path: '/telegram/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    let req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log(body);
        });
    });

    req.on('error', (e) => {
        console.log('problem with request: ' + e.message);
    });

    req.write(JSON.stringify({
        url: 'http://receiver:3003/'
    }));

    req.end();
}, 5000);
