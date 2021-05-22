const path = require('path');
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler
} = require('discord-akairo');
const Utils = require('./utils.js');
const ToDoList = require('../models/ToDoList')
const Reminder = require('../models/Reminder')
const mongoose = require('mongoose');
const ms = require('ms');
module.exports = class Client extends AkairoClient {
    constructor() {
        super(
            {
                ownerID: ['480407581085532180' ,'401406828820299777']
            },
            {
                disableEveryone: true
            }
        );

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands/'),
          automateCategories: true,
            prefix: ['n!']
        });
        
        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'listeners/')
        });
        this.db = {
            ToDoList,
            Reminder
        }
        this.Utils = new Utils(this);
      this.commandHandler.resolver.addType('time', (message, phrase) => {
        if(!phrase) return null;
        return ms(phrase);
      })
      this.commandHandler.resolver.addType('list', async (message, phrase) => {
              if(!phrase) return null;
        if(phrase == 'all') {
          const lists = await this.db.ToDoList.find({
            ownerID: message.author.id
          });
          return lists;
        }
              const list = await this.db.ToDoList.findOne({
                $or: [{listID: phrase} , {name: phrase}]
              });
        if(!list) return null;
        return list.ownerID == message.author.id ? list : 'You cannot access this list';
        })
      this.commandHandler.resolver.addType('reminder', async (message, phrase) => {
              if(!phrase) return null;
        if(phrase == 'all') {
          const reminders = await this.db.Reminder.find({
            ownerID: message.author.id
          });
          return reminders;
        }
              const reminder = await this.db.Reminder.findOne({
                $or: [{reminderID: phrase} , {name: phrase}]
              });
        if(!reminder) return null;
        return reminder.ownerID == message.author.id ? reminder : 'You cannot access this reminder';
        })
      this.commandHandler.resolver.addType('weather', async (message, phrase) => {
              if(!phrase) return message.channel.send("🙄 - **Please define your city**");
              const weather = await message.client.Utils.weather(phrase);
              return weather;
        })
    }

    async login(token) {
        mongoose.connect('mongodb+srv://mahdi:T3vSQLnvGLGFBBtC@games.xca7q.mongodb.net/noticsretryWrites=true&w=majority', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        .then(() => console.log('Connected to database'));
        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        return super.login(token);
    }
};
