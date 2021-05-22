const {
  Command
} = require('discord-akairo');
const Konva = require('konva-node')
const {
  loadImage
} = require("canvas")

class ViewCommand extends Command {
  constructor() {
      super('view', {
        aliases: ['view', 'v', ],
        description: {
          content: 'View a to do list, a subcommand of `todolist which means it should always be prefixed by it`'
        }
      })
    }
    * args() {
      const list = yield {
        type: 'list',
        match: 'content',
        prompt: {
          start: 'Input your list\'s `name` or `id` \n Write `all` to diplay all of your lists',
          retry: 'I cannot find the requested list'
        }
      }
      return {
        list
      }
    }
  async exec(message, args) {
    if (Array.isArray(args.list)) {
      return message.channel.send(args.list.map(({
        name
      }) => `\`${name}\``).join(' ') || 'empty')
    }
    const isOwner = typeof args.list == 'object';
    if (!isOwner) return message.channel.send(args.list);
    let chunks = (this.client.Utils.chunkify(args.list.children))
    let group, layer, stage, atts;
    for (let j = 0; j < chunks.length; j++) {
      let stage = new Konva.Stage({
        width: 600,
        height: 460,
      });
      let layer = new Konva.Layer();
      stage.add(layer);
      if (j === 0) {
        let background = new Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
          stroke: "#152C39",
          strokeWidth: 2,
          fill: "#081B25",
        });
        layer.add(background);
        var textNode = new Konva.Text({
          text: `What's up, ${message.author.username}`,
          x: 20,
          y: 20,
          fontSize: 24,
          fill: "white",
          width: 400,
          align: "left",
          fontFamily: 'Roboto'
        });

        layer.add(textNode);


        layer.add(new Konva.Rect({
          x: 25,
          y: 60,
          height: 100,
          width: 280,
          fill: '#152C39',
          cornerRadius: 15,
        }))
        layer.add(new Konva.Text({
          x: 40,
          y: 80,
          text: `${args.list.children.length || 0} tasks`,
          fontSize: 24,
          height: 100,
          width: 250,
          fill: '#8A959C',
        }))
        layer.add(new Konva.Text({
          x: 40,
          y: 100,
          text: args.list.name,
          fontSize: 32,
          height: 100,
          width: 250,
          fill: 'white',
        }))
        layer.add(new Konva.Rect({
          x: 25,
          y: 140,
          height: 8,
          width: 280,
          fill: '#0B161D',
        }))
        layer.add(new Konva.Rect({
          x: 25,
          y: 140,
          height: 8,
          fill: '#00B2FF',
          width: (args.list.children.filter(r => r.done).length * 100 / args.list.children.length) * 280 / 100,
        }))
        group = new Konva.Group({
          x: 25,
          y: 180,
        });
      } else {
        stage = new Konva.Stage({
          width: 600,
          height: 460,
        });
        layer = new Konva.Layer();
        stage.add(layer);
        let background = new Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
          stroke: "#152C39",
          strokeWidth: 2,
          fill: "#081B25",
        });
        layer.add(background);
        group = new Konva.Group({
          x: 25,
          y: 40,
        });
      }
      for (let i = 0; i < chunks[j].length; i++) {
        let task = args.list.children.find(r => r._id === chunks[j][i]._id)
        let index = args.list.children.indexOf(chunks[j][i])
        let colorGroup = new Konva.Group({
          x: 0,
          y: 55 * i,
          width: stage.width() - 50,
          height: 50,
        });
        colorGroup.add(new Konva.Rect({
          height: colorGroup.height(),
          width: colorGroup.width(),
          fill: '#152C39',
          cornerRadius: 15,
        }))
        const icon = await loadImage("https://cdn.discordapp.com/attachments/845288577108541490/845413846780215356/unknown.png")
        let circle = new Konva.Rect({
          x: 10,
          height: 25,
          width: 25,
          fill: task.done ? "#081B25" : undefined,
          stroke: task.done ? undefined : "#FF3AD4",
          strokeWidth: 3,
          cornerRadius: 25,
        })
        circle.y(50 / 2 - circle.getHeight() / 2);
        colorGroup.add(circle)
        if (task.done) {
          let ic = new Konva.Image({
            x: 15,
            height: 15,
            width: 15,
            image: icon,
          })
          ic.y(50 / 2 - ic.getHeight() / 2);
          colorGroup.add(ic)
        }
        let text = new Konva.Text({
          x: 50,
          text: index + " - " + task.content,
          fontSize: 18,
          fill: '#fff',
          width: 200,
          wrap: "char",
          ellipsis: true,
          align: 'left',
          hegiht: 50,
          verticalAlign: 'middle',
          textDecoration: task.done ? "line-through" : undefined,
        })
        text.y(50 / 2 - text.getHeight() / 2);
        colorGroup.add(text);
        group.add(colorGroup);
      }
      layer.add(group);
      layer.add(new Konva.Text({
        x: 10,
        y: stage.height() - 15,
        fill: "white",
        text: "Created by: NouNou#4144, decode me#7777 for Hack The Bot"
      }))
      const sfbuff = new Buffer.from(stage.toDataURL().split(",")[1], "base64");
      const attachment = this.client.util.attachment(sfbuff, 'HackTheBot.png');
      message.channel.send(attachment)
      // atts.push(attachment)
    }



    // return message.channel.send({files: atts})
  }
}
module.exports = ViewCommand;