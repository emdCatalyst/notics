const { Command, Flag } = require('discord-akairo');

class ToDoListCommand extends Command {
    constructor() {
        super('todolist', {
            aliases: ['todolist', 'tdl'],
            description: {
                content: 'Control todolists, create, remove or edit an existing todolist'
            },
        });
    }
    
    *args(message) {
        const subCommand = yield {
          type: ['create', 'delete', 'view', 'edit'],
          otherwise: 'Please append `create`, `delete`, `edit` or `view` to this command'
        }
        return Flag.continue(subCommand);
        
    }
    exec() {}
}

module.exports = ToDoListCommand;
