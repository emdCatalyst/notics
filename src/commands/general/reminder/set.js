const {
  Command,
  Argument,
  Flag
} = require('discord-akairo');
const ms = require("ms")
class SetCommand extends Command {
  constructor() {
    super('set', {
      aliases: ['set', 's', ],
      description: {
        content: 'Set a new reminder, a subcommand of `reminder` which means it should always be prefixed by it'
      },
    })
  }
  async before(message) {
      const activeDocs = this.client.db.Reminder.find({
        ownerID: message.author.id
      });
      const isOverLimit = (activeDocs.length >= 5);
      if (isOverLimit) message.channel.send(`You have reached your limit of 5 reminders and therefore cannot create more`);
      return !isOverLimit;
    }
    * args(message, passedName) {
      const name = yield {
        type: Argument.range('string', 5, 25),
        prompt: {
          start: 'I need your reminder name, you are limited to `5-25` char range'
        }
      }
      const duration = yield {
        type: 'time',
        prompt: {
          start: 'Please specify a time period for the reminder\n Exp: `1h` or `10min` or `2 days` ... ``w, m, y...``',
        }
      }
      const deliver = yield {
        type: ['dm', 'channel'],
        prompt: {
          start: 'Where do you want your reminder to be delivered at? \n `channel` or `dm`'
        }
      }
      return {
        name,
        duration,
        deliver
      };
    }

  async exec(message, args) {
    await this.client.db.Reminder.create({
      name: args.name,
      reminderID: message.id,
      finishsAt: Date.now() + args.duration,
      ownerID: message.author.id,
      channelID: args.deliver == 'dm' ? '' : message.channel.id,
      dm: args.deliver == 'dm'
    });
    message.channel.send(`Set a reminder for \`${args.name}\` \n You will receive your reminder in \`${ms(args.duration)}\``)
    setTimeout(async () => {
      args.deliver == 'dm' ? message.author.send("Hi im just here to remind you for **" + args.name + "**") : message.channel.send(message.author.toString() + "Hi im just here to remind you for **" + args.name + "**")
      await this.client.db.reminder.deleteOne({
        reminderID: message.id
      });
    }, args.duration)
  }
}
module.exports = SetCommand;