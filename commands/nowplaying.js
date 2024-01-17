module.exports.help = {
    name: 'nowplaying',
    description: 'check what is currently playing',
    guildonly: true,
    aliases: ['np'],
    cooldown: 3
}

// Skip youtube video to next in queue
module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue.`);
    const song = queue.songs[0];
    message.channel.send(`${client.emotes.play} | I'm playing **\`${song.name}\`**, by ${song.user}`);
}