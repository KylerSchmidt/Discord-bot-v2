module.exports.help = {
    name: 'reload',
    description: 'reload/restarts bot.',
    aliases: ['reboot', 'restartbot', 'rb'],
    admin: true,
    args: true,
    usage: '<command>',
    cooldown: 3
}

module.exports.run = async(client, message, args) => {
    const commandName =args[0].toLowerCase();
    const commandGet = message.client.commands.get(commandName)
    || message.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
    if (!commandGet) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
    const command = commandGet.help.name;
    
    delete require.cache[require.resolve(`./${command}.js`)];

    try {
        const newCommand = require(`./${command}.js`);
        message.client.commands.set(command, newCommand);
        message.channel.send(`Command \`${command}\` was reloaded!`);
    } catch (error) {
        console.log(error);
        message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
    }
}
