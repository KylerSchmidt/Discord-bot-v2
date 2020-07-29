//NOTE: all current code is in bot.js this is a TODO
module.exports.help = {
    name: 'stop',
    description: 'Destroys queue created from !play',
    guildonly: true
}

module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    serverQueue.songs = [];
    serverQueue.connection.disconnect();
}