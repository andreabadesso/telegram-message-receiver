'use strict';

const Message = require('./models/Message');

const connection = {
    host : '127.0.0.1',
    user : 'postgres',
    port: 32768,
    password : 'docker',
    database : 'keeptrack'
};

let message = new Message(connection);
message.createTable()
    .then(console.log, console.log);
