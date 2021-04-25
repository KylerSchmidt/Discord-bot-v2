const play = require('./play.js');
module.exports.help = {
    name: 'removesong',
    description: 'Removes a song from the queue',
    aliases: ['rs'],
    usage: '<song name>',
    args: true,
    voiceonly: true,
    guildonly: true,
    cooldown: 3
}

module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There are no songs in the queue');
    
    var args = message.content.split(' ');
    args = args.slice(1, args.length);
    var allargs = args.join(' ');

    const hasCompleteWord = (str, word) =>
        str.replace(/[^\w\s]/gi,"").replace(/\s+/g, " ").split(/\s+/).join(' ').includes(word.replace(/[^\w\s]/gi,"").replace(/\s+/g, " "));

    for (var i = 0; i < serverQueue.songs.length; i++)
    {
        if(hasCompleteWord(serverQueue.songs[i].title.toLowerCase(), allargs.toLowerCase()))
        {
            var removedsong = serverQueue.songs[i].title;
            serverQueue.songs.splice(i, 1);
            return message.channel.send(removedsong + ' has been removed from the queue!');
        }
    }
    message.channel.send('Song not found in the queue');
}