const { Command }= require('discord-akairo');

class CancelCommand extends Command {
  constructor() {
    super('cancel', {
      aliases: ['cancel', 'ca', ],
      description: {
        content: 'Cancel a reminder, a subcommand of `reminder` which means it should always be prefixed by it'
      },
      args: [
        {
          id: 'reminder',
          type: 'reminder',
          match: 'content',
          prompt: {
            start: 'Input your reminder\'s `name` or `id` \n Write `all` to cancel all of your reminders', 
            retry: 'I cannot find the requested reminder'
          }
        }
      ]
    })
  }
  
  async exec(message, args) {
    if(Array.isArray(args.reminder)) {
      args.reminder.forEach(async ({reminderID}) => {
        await this.client.db.Reminder.deleteOne({reminderID});
      });
      return message.channel.send('deleted \n' + args.reminder.map(({name}) => `\`${name}\``).join(' '))
    }
    const isOwner = typeof args.reminder == 'object';
    if(!isOwner) return args.reminder;
    await this.client.db.Reminder.deleteOne({reminderID: args.reminder.reminderID});
    message.channel.send(`Deleted \`${args.reminder.name}\``);
  }
}
module.exports = CancelCommand;