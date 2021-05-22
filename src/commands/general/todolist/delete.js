const { Command }= require('discord-akairo');

class DeleteCommand extends Command {
  constructor() {
    super('delete', {
      aliases: ['delete', 'd', ],
      description: {
        content: 'Delete a to do list, a subcommand of `todolist which means it should always be prefixed by it`'
      },
      args: [
        {
          id: 'list',
          type: 'list',
          match: 'content',
          prompt: {
            start: 'Input your list\'s `name` or `id` \n Write `all` to delete all of your lists', 
            retry: 'I cannot find the requested list'
          }
        }
      ]
    })
  }
  
  async exec(message, args) {
    if(Array.isArray(args.list)) {
      args.list.forEach(async ({listID}) => {
        await this.client.db.ToDoList.deleteOne({listID});
      });
      return message.channel.send('deleted \n' + args.list.map(({name}) => `\`${name}\``).join(' '))
    }
    const isOwner = typeof args.list == 'object';
    if(!isOwner) return args.list;
    await this.client.db.ToDoList.deleteOne({listID: args.list.listID});
    message.channel.send(`Deleted \`${args.list.name}\` with \`${args.list.children.length}\` tasks in total`);
  }
}
module.exports = DeleteCommand;