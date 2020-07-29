module.exports.help = {
    name: 'nowplaying',
    description: 'check what is currently playing',
    guildonly: true,
    aliases: ['np']
}

// Skip youtube video to next in queue
module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
}