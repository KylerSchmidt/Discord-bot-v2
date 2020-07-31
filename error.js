// Function for when a command runs into a problem thats generalized
// IE - Server only. Wrong arguements. etc.
// RETURN 1 FOR ERROR. RETURN 0 FOR NO ERROR.
exports.errors = function(client, message, argsArr, commandName, commandHelp, prefix) {
    // GuildOnly Error 
    if(commandHelp.help.guildonly && message.channel.type !== 'text') 
    {
        message.reply(`${commandHelp.help.name} cannot be executed in DMs!`);
        return 1;
    }

    if(commandHelp.help.voiceonly && !message.member.voice.channel)
    {
        message.reply(`${commandHelp.help.name} cannot be executed without being in a voice channel!`);
        return 1;
    }

    // Arguments - command needs arguments
    if (commandHelp.help.args && !argsArr.length) 
    {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        
        // Usage - if arguements are needed, show user how to use the command.
        if(commandHelp.help.usage)
            reply += `\nThe proper usage would be: \`${prefix}${commandHelp.help.name} ${commandHelp.help.usage}\``;

        message.channel.send(reply);
        return 1;
    }

    return 0;
}