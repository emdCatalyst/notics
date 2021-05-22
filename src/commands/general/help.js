const { Command } = require ('discord-akairo');
const { MessageEmbed } = require ('discord.js');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            description: {
                content: 'Displays a list of available command, or detailed information for a specific command.',
                usage: '[command]'
            },
            ratelimit: 2,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    }

    async exec(message, {command}) {
        const prefix = this.handler.prefix;
        if (!command) {
            const embed = new MessageEmbed()
                .setColor([155, 200, 200])
                .addField('Commands', `A list of available commands.
                    Please note that almost all commands use prompt based input
                    For additional info on a command, type \`${prefix}help <command>\`
                `)
            for (const category of this.handler.categories.values()) {
                embed.addField(`${category.id.replace(/(\b\w)/gi, (lc)=> lc.toUpperCase())}`, `${category.filter((cmd) => cmd.aliases.length > 0).map((cmd)=> `\`${cmd.aliases[0]}\``).join(' ')}`);
            }

            return message.channel.send(embed);
        }

        const embed = new MessageEmbed()
            .setTitle(`\`${command.aliases[0]}\``)
            .addField(' Description', `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[Owner Only]**': ''}`);

        if (command.aliases.length > 1) embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples && command.description.examples.length) embed.addField('Examples', `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``, true);

        return message.channel.send(embed);
    }
    
}
module.exports = HelpCommand;