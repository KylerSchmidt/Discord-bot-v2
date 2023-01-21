const play = require('./play.js');
module.exports.help = {
    name: 'skip',
    description: 'Skip song in playlist of songs added via !play',
    voiceonly: true,
    guildonly: true,
    cooldown: 2
}

// Skip youtube video to next in queue
module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    var setvol = 0;
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    if(args.length)
    {
        setvol = parseInt(args[0]) - 1;
    }

    for (var i = 0; i <= setvol; i++)
    {
        if(Object.keys(serverQueue.songs).length)
            serverQueue.songs.shift();
        else
            break;
    }
    serverQueue.dispatcher.destroy(); 
    
    play.plays(message, serverQueue.songs[0]);
}