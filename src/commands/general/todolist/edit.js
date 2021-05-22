const {
  Command,
  Argument,
  Flag
} = require('discord-akairo');

class ModifyCommand extends Command {
  constructor() {
    super('edit', {
      aliases: ['edit', 'e', ],
      description: {
        content: 'Edit an existing to do list, a subcommand of `todolist which means it should always be prefixed by it`'
      }
    })
  }

  * args(message) {
    const list = yield {
      type: 'list',
      match: 'content',
      prompt: {
        start: 'Input your list\'s `name` or `id`',
        retry: 'I cannot find the requested list'
      }
    }

    const toModify = yield {
      type: ['name', 'tasks'],
      prompt: {
        start: 'What section would you like to edit? \n `name` or `tasks` is allowed',
      }
    }
    if (toModify == 'name') {
      const newValue = yield {
        prompt: {
          start: 'What is your new desired name?'
        }
      };
      return {
        list,
        toModify,
        newValue
      };
    } else {
      const position = yield {
        type: Argument.range('number', 1, list.children.length + 1),
        prompt: {
          start: 'What is the order of the task you want to edit?'
        }
      };
      const action = yield {
        type: ['delete', 'done', 'undone', 'content'],
        prompt: {
          start: 'What do you want to do? \n You\'re allowed to `delete`, `done`, `content` or `undone`'
        }
      }
      if (action == 'content') {
        const newValue = yield {
          prompt: {
            start: `What do you want to use instead of \`${list.children[position-1].content}\`?`
          }
        }
        return {
          list,
          toModify,
          position,
          action,
          newValue
        }
      }
      return {
        list,
        toModify,
        position,
        action
      }
    }
  }

  async exec(message, args) {
    if (args.toModify == 'name') {
      await this.client.db.ToDoList.updateOne({
        listID: args.list.listID
      }, {
        name: args.newValue
      });
      message.channel.send(`Changed name from \`${args.list.name}\` to \`${args.newValue}\``)
    } else {
      const child = args.list.children[args.position - 1];
      if (args.action == 'delete') {
        await this.client.db.ToDoList.updateOne({
          listID: args.list.listID
        }, {
          children: args.list.children.filter(ch => ch != child)
        });
        message.channel.send(`Deleted \`${child.content}\``)
      } else if (args.action == 'content') {
        args.list.children[args.position - 1].content = args.newValue;
        await this.client.db.ToDoList.updateOne({
          listID: args.list.listID
        }, {
          children: args.list.children
        });
        message.channel.send(`Switched content to \`${args.newValue}\``)
      } else {
        const done = (args.action == 'done');
        args.list.children[args.position - 1].done = done;
        await this.client.db.ToDoList.updateOne({
          listID: args.list.listID
        }, {
          children: args.list.children
        });
        message.channel.send(`Set \`${child.content}\` state to \`${args.action}\``)
      }
    }
  }
}
module.exports = ModifyCommand;