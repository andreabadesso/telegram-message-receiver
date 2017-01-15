'use strict';

const Promise  = require('bluebird'),
        _      = require('lodash'),
        bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'MessageModel'
});

module.exports = class Message {

    constructor(connection) {
        this.tableName = 'group_messages';
        this.knex = require('knex')({
            client: 'pg',
            connection: connection
        });
    }

    createMessage(text, date, from_name, group_id, metadata, group_name, from_id, from_username) {

        return this.knex(this.tableName)
                .insert({
                    text: text,
                    date: date,
                    from_name: from_name,
                    from_id: from_id,
                    group_id: group_id,
                    group_name: group_name,
                    from_username: from_username,
                    metadata: metadata
                })
                .returning('*');
    }

    createTable() {
        return this.knex.schema
            .createTableIfNotExists(this.tableName, table => {
                table.increments();
                table.string('text');
                table.datetime('date');
                table.string('from_name');
                table.string('group_name');
                table.string('from_id');
                table.string('from_username');
                table.string('group_id');
                table.specificType('metadata', 'json');
                table.timestamps();
            });
    }
};
