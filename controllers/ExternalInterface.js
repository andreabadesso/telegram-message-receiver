'use strict';

const Message = require('../models/Message');

const connection = {
    host : process.env.PG_HOST,
    port: process.env.PG_PORT,
    user : process.env.PG_USER,
    password : process.env.PG_PASS,
    database : process.env.PG_DB
};

let message = new Message(connection);

/* This will expose http methods and connect
 * them to the available bots
 */
class ExternalInterface {
    constructor(server) {
        this.server = server;

        this.registerRoutes();
    }

    handleNewMessage(req, res, next) {
        console.log('Handling message ..');
        let m = req.body;

        message.createMessage(m.text,
                              m.time,
                              m.from.first_name,
                              m.id,
                              JSON.stringify(m))
            .then(_message => {
                res.send({
                    status: 200,
                    message: _message
                });
            }, function(err) {
                console.log(err);
            });
    }

    registerRoutes() {
        this.server.post('/grupos/:id/mensagens', this.handleNewMessage.bind(this));
    }

}

module.exports = ExternalInterface;
