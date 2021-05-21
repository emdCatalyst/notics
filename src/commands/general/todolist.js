const { Command } = require('discord-akairo');

class ToDoListCommand extends Command {
    constructor() {
        super('todolist', {
            aliases: ['todolist', 'tdl'],
            description: {
                content: 'Control todolists, create, remove or edit an existing todolist'
            },
            ownerOnly: true
        });
    }
    *args(message) {
        const name = yield {
            type: 'string',
            prompt: {
                start: 'حبيبي هات اسم لا اصفقك'
            }
        }
        const notes = yield {
            type: 'string',
            prompt: {
                start: 'ارسل الالمنتس جبيبي',
                infinite: true,
                stopWord: 'خلصت'
            }
        }
        return { name, notes };
    }
    async exec(message, args) {
        message.channel.send({
            embed: {
                title: 'your todo list items '+ args.name,
                description: args.notes.map(n => n.split(',')).join('\n')
            }
        })
    }
}

module.exports = ToDoListCommand;
