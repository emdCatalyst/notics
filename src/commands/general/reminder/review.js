const { Command }= require('discord-akairo');
const ms = require('ms');
class ReviewCommand extends Command {
  constructor() {
    super('review', {
      aliases: ['review', 'rv', ],
      description: {
        content: 'Review a reminder\'s info, a subcommand of `reminder` which means it should always be prefixed by it'
      },
    })
  }
  
  *args() {
        const reminder = yield {
          type: 'reminder',
          match: 'content',
          prompt: {
            start: 'Input your reminder\'s `name` or `id` \n Write `all` to diplay all of your reminders',
            retry: 'I cannot find the requested reminder'
          }
        }
        return {reminder}
  }
  async exec(message, args) {
    console.log(args.reminder)
    if(Array.isArray(args.reminder)) {
      return message.channel.send(args.reminder.map(({name}) => `\`${name}\``).join(' ') || 'empty')
    }
    const isOwner = typeof args.reminder == 'object';
    if(!isOwner) return message.channel.send(args.reminder);
    const embed = this.client.util.embed()
    .setTitle(args.reminder.name)
    .addField('Ends in', ms(args.reminder.finishsAt - Date.now()))
    message.channel.send(embed)
  }
}
module.exports = ReviewCommand;