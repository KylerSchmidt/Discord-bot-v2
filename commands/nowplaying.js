const Discord = module.require('discord.js');
module.exports.help = {
    name: 'nowplaying',
    description: 'check what is currently playing',
    guildonly: true,
    aliases: ['np'],
    cooldown: 3
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
    if(typeof desc === 'undefined') desc = 'no desc';
    console.log(desc.length);
    if(desc.length >= 1000) desc = desc.substring(0, 900) + '\n**Too Long of a Desc to display full!**';
    // console.log(curSong.desc.length);
    let cEmbed = new Discord.MessageEmbed()
        .setTitle("**NOW PLAYING**")
        .setColor("RANDOM")
        .addField('Title', curSong.title)
        .addField('URL', url)
        .addField('About', desc)
        .setTimestamp()

    return message.channel.send({embed: cEmbed});
}