module.exports.help = {
    name: 'stop',
    description: 'Destroys queue created from !play',
    voiceonly: true,
    guildonly: true,
    cooldown: 3
}

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message);
    queue.stop();
    message.channel.send(`${client.emotes.success} | Stopped!`);
}