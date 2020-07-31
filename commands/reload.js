module.exports.help = {
    name: 'reload',
    description: 'reload/restarts bot.',
    aliases: ['reboot', 'restartbot', 'rb'],
    args: true,
    usage: '<command>'
}

module.exports.run = async(client, message, args) => {

    if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR'))
        return message.reply("Admin privilages needed to run this command");

    const commandName =args[0].toLowerCase();
    const command = message.client.commands.get(commandName)
	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
    
    delete require.cache[require.resolve(`./${commandName}.js`)];

    try {
        const newCommand = require(`./${commandName}.js`);
        message.client.commands.set(commandName, newCommand);
        message.channel.send(`Command \`${commandName}\` was reloaded!`);
    } catch (error) {
        console.log(error);
        message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
    }
    
}