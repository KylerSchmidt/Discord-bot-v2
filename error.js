// Function for when a command runs into a problem thats generalized
// IE - Server only. Wrong arguements. etc.
exports.errors = function(client, message, argsArr, commandName, commandHelp, prefix) {
    // GuildOnly Error 
    if(commandHelp.help.guildonly && message.channel.type !== 'text') {
        return message.reply(`${commandHelp.help.name} cannot be executed in DMs!`)
    }

    // Arguments - command needs arguments
    if (commandHelp.help.args && !argsArr.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        
        // Usage - if arguements are needed, show user how to use the command.
        if(commandHelp.help.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${commandHelp.help.name} ${commandHelp.help.usage}\``;
        }

        return message.channel.send(reply);
    }
}