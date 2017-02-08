'use strict';

const Message = require('../models/Message');
const http = require('http');
const RECEIVER_URL = process.env.RECEIVER_URL;
const MIDDLEWARE_PORT = process.env.MIDDLEWARE_PORT;

const connection = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB
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

    registerOnMiddleware() {
        let options = {
            hostname: 'middleware',
            port: MIDDLEWARE_PORT,
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
            url: RECEIVER_URL
        }));

        req.end();
    }

    _cleanName(firstName, lastName) {
        let name = firstName;
        if (lastName) {
            name += ` ${lastName}`;
        }

        return name;
    }

    handleNewMessage(req, res, next) {
        console.log('Handling message ..');
        let m = req.body;

        message.createMessage(
                m.text,
                m.time,
                this._cleanName(m.from.first_name, m.from.last_name),
                m.id,
                JSON.stringify(m),
                m.title,
                m.from.userId,
                m.from.username
            )
            .then(_message => {
                res.send({
                    status: 200,
                    message: _message
                });
            }, function(err) {
                console.log(err);
            });
    }

    findGroupMessages(req, res, next) {
        let groupId = req.params.id;
        let page = req.query.page;

        return message.findGroupMessages(groupId, page)
            .then(messages => {
                return res.send({
                    status: 200,
                    messages: messages.rows
                });
            }, err => {
                console.log(err);
                return res.send({
                    status: 500
                });
            });
    }

    findGroups(req, res, next) {
        return message.findGroups()
                .then(groups => {
                return res.send({
                    status: 200,
                    groups: groups.rows
                });
        }, err => {
            console.log(err);
            return res.send({
                status: 500
            });
        });
    }

    registerRoutes() {
        this.server.post('/groups/:id/messages', this.handleNewMessage.bind(this));
        this.server.get('/groups/:id/messages', this.findGroupMessages.bind(this));
        this.server.get('/groups', this.findGroups.bind(this));
    }

}

module.exports = ExternalInterface;
