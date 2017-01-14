'use strict';

const http = require('http'),
    fs = require('fs');

function requestHandler(req, res) {
    console.log(req, res);
}

const server = http.createServer(requestHandler);

server.listen(3003, () => {
    console.log('Server listening on: http://localhost:%s', 3003);
});

setTimeout(function() {
    var options = {
        hostname: 'middleware',
        port: 3001,
        path: '/telegram/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(body) {
            console.log(body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(JSON.stringify({
        url: 'http://receiver:3003/'
    }));

    req.end();
}, 5000);
