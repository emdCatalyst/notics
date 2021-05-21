const path = require('path');
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler
} = require('discord-akairo');
const Utils = require('./utils.js');
const ToDoList = require('../models/ToDoList')

module.exports = class Client extends AkairoClient {
    constructor() {
        super(
            {
                ownerID: ['401406828820299777', '480407581085532180', '353760389747441665']
            },
            {
                disableEveryone: true
            }
        );

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands/'),
            prefix: ['n!']
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'listeners/')
        });
        this.db = {
            ToDoList
        }
        this.Utils = new Utils(this);
    }

    async login(token) {
        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        return super.login(token);
    }
};
