const {
  Command
} = require('discord-akairo');
const Discord = require('discord.js');
const Konva = require('konva-node');
const {
  loadImage
} = require("canvas")
const {
  get
} = require('axios');
const urls = [
  ["https://cdn.discordapp.com/attachments/494518397607084054/845378320681664612/unknown.png",
    "https://cdn.discordapp.com/attachments/494518397607084054/845378344882012180/unknown.png",
    "https://cdn.discordapp.com/attachments/494518397607084054/845378287944859698/unknown.png"
  ],
  [{
      name: "09 10",
      url: "https://cdn.discordapp.com/attachments/494518397607084054/845371587813572659/unknown.png"
    },
    {
      name: "11",
      url: "https://cdn.discordapp.com/attachments/494518397607084054/845371630258880572/unknown.png"
    },
    {
      name: "02 03 04",
      url: "https://cdn.discordapp.com/attachments/494518397607084054/845371677780213880/unknown.png"
    },
    {
      name: "13",
      url: "https://cdn.discordapp.com/attachments/494518397607084054/845371697812733962/unknown.png"
    },
    {
      name: "50",
      url: "https://cdn.discordapp.com/attachments/494518397607084054/845371723804966933/unknown.png"
    },
    {
      name: "01",
      url: "https://cdn.discordapp.com/attachments/494518397607084054/845371609408602112/unknown.png"
    },
  ]
]
class Weatherommand extends Command {
  constructor() {
    super('weather', {
      aliases: ['weather'],
      description: {
        content: 'Check out the weather in a city, province or a country',
        examples: [
          'Algeria',
          'Setif'
        ]
      },
      args: [{
        id: 'weather',
        type: 'weather',
        match: 'content',
        prompt: {
          start: 'Input your city\'s name',
          retry: ':x: - **I cannot find the provided city**'
        }
      }]
    });
  }

  async exec(message, args) {
    let status = await loadImage(urls[1].find(ic => ic.name.includes(args.weather.icon.slice(0, -1))).url)
    let stage = new Konva.Stage({
      width: 500,
      height: 300,
    });
    let layer = new Konva.Layer();
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

    let circle = new Konva.Rect({
      x: 425,
      y: 225,
      width: 100,
      height: 100,
      stroke: "#152C39",
      strokeWidth: 10,
      cornerRadius: 100,
    });
    layer.add(circle);
    let circle2 = new Konva.Rect({
      x: 350,
      y: 20,
      width: 100,
      height: 100,
      cornerRadius: 100,
      fillLinearGradientStartPoint: {
        x: 0,
        y: 0
      },
      fillLinearGradientEndPoint: {
        x: 100,
        y: 100
      },
      fillLinearGradientColorStops: [0, '#FF3AD4', 1, '#00B2FF'],
      shadowColor: '#4AC9FF',
      shadowBlur: 20,
      shadowOffset: {
        x: -5,
        y: 5
      },
      shadowOpacity: 0.25,
    });
    layer.add(circle2);
    layer.add(new Konva.Image({
      image: status,
      x: 320,
      y: 50,
    }))
    let group = new Konva.Group({
      x: 40,
      y: 20,
      width: 200,
      height: 100,
    })
    group.add(new Konva.Rect({
      x: 0,
      y: 0,
      width: group.width(),
      height: group.height(),
      cornerRadius: 15,
      fill: "#152C39"
    }));
    group.add(new Konva.Text({
      x: 10,
      y: 10,
      text: args.weather.name,
      fill: "white",
      fontSize: 16,
    }))
    group.add(new Konva.Text({
      x: 10,
      y: 40,
      text: args.weather.temp + "°",
      fill: "white",
      fontSize: 48,
    }))
    group.add(new Konva.Rect({
      x: 100,
      y: 60,
      height: 25,
      width: 70,
      fill: "#3240BD",
      cornerRadius: 10,
    }))
    group.add(new Konva.Text({
      x: 100,
      y: 60,
      height: 25,
      width: 70,
      text: args.weather.weather,
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      fontSize: 16,
    }))
    layer.add(group)
    const labels = ['Wind', 'Humidity', 'Pressure']
    for (let i = 1; i <= labels.length; i++) {
      let image = await loadImage(urls[0][i - 1])
      let group = new Konva.Group({
        x: i === 1 ? 40 : i === 2 ? (145 + 40) : 145 * 2 + 40,
        y: 180,
        width: 140,
        height: 100,
      })
      group.add(new Konva.Rect({
        x: 0,
        y: 0,
        width: group.width(),
        height: group.height(),
        cornerRadius: 15,
        fill: "#152C39"
      }));
      group.add(new Konva.Text({
        x: 10,
        y: 10,
        text: labels[i - 1],
        fill: "white",
        fontSize: 16,
      }))
      group.add(new Konva.Text({
        x: 10,
        y: 40,
        text: args.weather[labels[i - 1].toLowerCase()],
        fill: "white",
        fontSize: 48,
      }))
      group.add(new Konva.Image({
        x: 90,
        y: 10,
        height: 30,
        width: 30,
        image,
      }))
      layer.add(group)
    }
    layer.add(new Konva.Text({
      x: 10,
      y: stage.height() - 15,
      fill: "white",
      text: "Created by: NouNou#4144, decode me#7777 for Hack The Bot"
    }))
    const sfbuff = new Buffer.from(stage.toDataURL().split(",")[1], "base64");
    const attachment = new Discord.MessageAttachment(sfbuff, 'HackTheBot.png');

    return message.channel.send(attachment)
  }
}

module.exports = Weatherommand;