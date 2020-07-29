// Initalize
const Discord = require("discord.js");
const { botPrefix } = require('../config.json');

module.exports.help = {
    name: 'help',
    description: 'List all other commands or learn more about a command',
    aliases: ['commands'],
    usage: '[command name]'
}

//gives help for entire database. 
module.exports.run = async(client, message, args) => {
    let data = [];
    const { commands } = message.client;
    //if nothing is given, means user wants general help information
    if(!args.length) {
        //push to data all .js commands
        data.push(commands.map(command => command.help.name).join('\n'));
        //push for information at bottom
        data.push(`\nYou can send \'${botPrefix}help [command name]\' to get specific info`);

        let cEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .addField("Commands:", data)
            .setTimestamp()
        return message.channel.send({embed: cEmbed});
        // used to send to direct meesage instead of in channel.
        // return message.author.send(data, { split: true })
        //     .then(() => {
        //         if (message.channel.type === 'dm') return;
        //         message.reply('I\'ve sent you a DM with all my commands!');
        //     })
        //     .catch(error => {
        //         console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
        //         message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
        //     });
    }
    const name = args[0].toLowerCase();
    //console.log(commands);
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
    // could not find the command asked for
    if (!command) {
        return message.reply('that\'s not a valid command!');
    }
    
    //push information about the given command from the files modules.exports.help
    data.push(`**Name:** ${command.help.name}\n`);
    if (command.help.aliases) data.push(`**Aliases:** ${command.help.aliases.join(' ')}\n`);
    if (command.help.description) data.push(`**Description:** ${command.help.description}\n`);
    if (command.help.usage) data.push(`**Usage:** ${botPrefix}${command.help.name} ${command.help.usage}\n`);
    if (command.help.guildonly) {
        command.help.guildonly = 'nope';
        data.push(`**Can I DM this command?:** ${command.help.guildonly}\n`);
    }
    if (command.help.cooldown) data.push(`**Cooldown:** ${command.help.cooldown || 3} second(s)\n`);
    if (command.help.todo) data.push(`**TODO:** ${command.help.todo}\n`);
    // data = JSON.stringify(data).replace(/,/g, '');
    // data = JSON.parse(data);
    // let cEmbed = new Discord.MessageEmbed()
    //         .setColor("RANDOM")
    //         .addField(`${data}`,"Discord bot help desk")
    //         .setTimestamp()
    // message.channel.send({embed: cEmbed, split: true });

    message.channel.send(data, { split: true });
}

