// Initalize
const Discord = require("discord.js");
const { botPrefix } = require('../config.json');

module.exports.help = {
    name: 'help',
    description: 'List all other commands or learn more about a command',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 3
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
        let cEmbed = new Discord.EmbedBuilder()
            .setColor("Random")
            .addFields({name: "Commands:", value: data.toString()})
            .setTimestamp()
        return message.channel.send({embeds: [cEmbed]});

        // return message.channel.send("Commands - \n" + data);
    }
    
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.help.aliases && c.help.aliases.includes(name));
    // could not find the command asked for
    if (!command) {
        return message.reply('that\'s not a valid command!');
    }

    let Description = command.help.description
    if(typeof(command.help.aliases) != 'undefined'){
        let Aliases = command.help.aliases.toString()
    }
    let Useage = command.help.usage
    let Guildonly = command.help.guildonly
    let CooldownTimer = command.help.cooldown.toString()
    let Todo = command.help.todo
    
    if(typeof(Description) == 'undefined') Description = 'no Description';
    if(typeof(Aliases) == 'undefined') Aliases = 'no Aliases';
    if(typeof(Useage) == 'undefined') Useage =''; 
    if(typeof(Guildonly) == 'undefined') Guildonly = 'No';
    else if(Guildonly) Guildonly = 'Yes'; else Guildonly = 'No';
    if(typeof(CooldownTimer) == 'undefined') CooldownTimer = 'no cooldown';
    if(typeof(Todo) == 'undefined') Todo = 'no current todo list';
    
    let cEmbed = new Discord.EmbedBuilder()
            .setAuthor({name: command.help.name})
            .setColor("Random")
            .addFields(
                {name: 'Description:', value: Description},
                {name: 'Aliases:', value: Aliases},
                {name: 'Usage:', value: `${botPrefix}${command.help.name} ${Useage}`},
                {name: 'Guildonly:', value: Guildonly},
                {name: 'CooldownTimer:', value: CooldownTimer},
                {name: 'TODO:', value: Todo},
                )
            // .addField('Aliases:', Aliases)
            // .addField('Usage:', `${botPrefix}${command.help.name} ${Useage}`)
            // .addField('Guildonly?:', Guildonly)
            // .addField('CooldownTimer:', CooldownTimer)
            // .addField('TODO:', Todo)
            .setTimestamp()
    message.channel.send({embeds: [cEmbed]});
}

