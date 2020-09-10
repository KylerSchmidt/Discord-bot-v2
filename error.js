const Discord = require("discord.js");
// Function for when a command runs into a problem thats generalized
// IE - Server only. Wrong arguements. etc.
// RETURN 1 FOR ERROR. RETURN 0 FOR NO ERROR.
exports.errors = function(client, message, argsArr, commandName, commandHelp, cooldowns, prefix) {
    // Admin error
    if(commandHelp.help.admin && !message.guild.member(message.author).hasPermission('ADMINISTRATOR'))
    {
        message.reply("Admin privilages needed to run this command");
        return 1;
    }
    
    
    // Cooldown errors
    if (commandHelp.help.cooldown != null)
    {
        // If cooldown not created for command, create it.
        if (!cooldowns.has(commandHelp.help.name)) {
            cooldowns.set(commandHelp.help.name, new Discord.Collection());
        }

        // Get date, timestamps on previous command, & cooldown
        const now = Date.now();
        const timestamps = cooldowns.get(commandHelp.help.name);
        const cooldownAmount = (commandHelp.help.cooldown || 3) * 1000;
        
        // If it was the person who sent the command earlier...
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            console.log(expirationTime);
            // Check if the user can use command
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
                return 1;
            }
        }
        // setup timestamp, or delete if time is out.
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    
    
    
    // GuildOnly Error 
    if(commandHelp.help.guildonly && message.channel.type !== 'text') 
    {
        message.reply(`${commandHelp.help.name} cannot be executed in DMs!`);
        return 1;
    }

    // VoiceOnly Error
    if(commandHelp.help.voiceonly && !message.member.voice.channel)
    {
        message.reply(`${commandHelp.help.name} cannot be executed without being in a voice channel!`);
        return 1;
    }

    // Arguments Error
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