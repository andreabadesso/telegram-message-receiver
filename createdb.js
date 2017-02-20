'use strict';

const Message = require('./models/Message');

const connection = {
    host: '172.18.0.1',
    user: 'postgres',
    port: 5432,
    password: '',
    database: 'trak'
};

let message = new Message(connection);
message.createTable()
    .then(console.log, console.log);
