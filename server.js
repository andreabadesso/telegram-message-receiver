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
externalInterface.registerOnMiddleware();

app.listen(3003);
