const play = require('./play.js');
module.exports.help = {
    name: 'stop',
    description: 'Destroys queue created from !play',
    voiceonly: true,
    guildonly: true,
    cooldown: 3
}

module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if(typeof(serverQueue) == 'undefined')
        return;
    serverQueue.songs = [];
    play.plays(message, serverQueue.songs[0]);
}