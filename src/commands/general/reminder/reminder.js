const { Command, Flag } = require('discord-akairo');

class ReminderCommand extends Command {
    constructor() {
        super('reminder', {
            aliases: ['reminder', 'rem'],
            description: {
                content: 'Control reminders, set, cancel or review an existing reminder'
            },
        });
    }
    *args(message) {
        const subCommand = yield {
          type: ['set', 'cancel', 'review'],
          otherwise: 'Please append `set`, `cancel` or `review` to this command'
        }
        return Flag.continue(subCommand);
        
    }
    exec() {}
}

module.exports = ReminderCommand;
