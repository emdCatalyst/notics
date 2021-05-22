const {
  Command,
  Argument,
  Flag
} = require('discord-akairo');

class CreateCommand extends Command {
  constructor() {
    super('create', {
      aliases: ['create', 'c', ],
      description: {
        content: 'Create a to do list, a subcommand of `todolist which means it should always be prefixed by it`'
      }
    })
  }
  async before(message) {
      const activeDocs = this.client.db.ToDoList.find({
        ownerID: message.author.id
      });
      const isOverLimit = (activeDocs.length >= 10);
      if (isOverLimit) message.channel.send(`You have reached your limit of 10 lists and therefore cannot create more`);
      return !isOverLimit;
    }
    * args(message, passedName) {
      const name = yield {
        type: Argument.range('string', 5, 25),
        prompt: {
          start: 'I need your list name, you are limited to `5-25` char range'
        }
      }
      const items = yield {
        prompt: {
          infinite: true,
          stopWord: 'save',
          limit: 25,
          start: 'You should input your list items now, every phrase you send will count as an item',
          modifyStart: (message, text, data) => `${text} \n Type \`save\` to save your list`
        }
      }
      if (items.length < 2) return Flag.fail();
      const viewEmbed = message.client.util.embed()
        .setTitle(name)
        .setDescription(items.join('\n'))
      message.channel.send(viewEmbed);
      const answer = yield {
        prompt: {
          start: 'Are you sure? \n `yes` or `no`',
          retries: 2
        },
        type: ['yes', 'no']
      };
      if (answer == 'yes') return {
        name,
        items
      }
      else return Flag.continue('create');
    }

  async exec(message, args) {
    await this.client.db.ToDoList.create({
      name: args.name,
      ownerID: message.author.id,
      listID: message.id,
      children: args.items.map(it => ({
        content: it
      })),
      createdAt: new Date().getTime()
    });
    message.channel.send(`Saved your list \`${args.name}\` with \`${args.items.length}\` tasks in total.`);
  }
}
module.exports = CreateCommand;