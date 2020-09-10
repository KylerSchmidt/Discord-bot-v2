const Discord = module.require('discord.js');
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
    const curSong = serverQueue.songs[0];
    var url = curSong.url;
    var desc = curSong.desc;
    if(curSong.url == ' ')
    {
        url = 'no url';
        desc = 'no desc';
    }
    if(curSong.desc.length >= 1024) curSong.desc = curSong.desc.substring(0, 980) + '\n**Too Long of a Desc to display full!**';
    let cEmbed = new Discord.MessageEmbed()
        .setTitle("**NOW PLAYING**")
        .setColor("RANDOM")
        .addField('Title', curSong.title)
        .addField('URL', url)
        .addField('About', desc)
        .setTimestamp()

    return message.channel.send({embed: cEmbed});
}