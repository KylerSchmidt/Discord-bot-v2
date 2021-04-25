
const play = require('./play.js');
module.exports.help = {
    name: 'restart',
    description: 'restart the current song',
    guildonly: true,
    aliases: ['re'],
    cooldown: 3
}

// Skip youtube video to next in queue
module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    play.plays(message, serverQueue.songs[0]);
}