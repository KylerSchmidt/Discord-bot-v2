const play = require('./play.js');
module.exports.help = {
    name: 'skip',
    description: 'Skip song in playlist of songs added via !play',
    voiceonly: true,
    guildonly: true
}

// Skip youtube video to next in queue
module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.dispatcher.destroy(); 
    serverQueue.songs.shift();
    play.plays(message, serverQueue.songs[0]);
}