const Discord = module.require('discord.js');
module.exports.help = {
    name: 'queue',
    description: 'Display first 10 songs in the queue',
    aliases: ['q'],
    usage: '<page number>',
    voiceonly: true,
    cooldown: 5,
    guildonly: true
}

module.exports.run = async(client, message, args) => {
    var arg = parseInt(args[0]);
    if(isNaN(arg) || arg < 0) arg = 1;
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is currently no queue.');
    var i = 0;
    var songPlace = 0;
    var list = '';

    for(i in serverQueue.songs)
    {
        songPlace = parseInt(i) + (8 * (arg - 1));
        if(Object.keys(serverQueue.songs).length < songPlace + 1) break;
        list += '\n' + songPlace + ": " + serverQueue.songs[songPlace].title + "\n" + serverQueue.songs[songPlace].url;
        if (serverQueue.songs[songPlace].isLive)
            list += "\n**Note: song above is live **";
        list += "\n\n"
        i++;
        if (i > 8)
        {
            // not at the end of list. let user know there are more.
            if(!Object.keys(serverQueue.songs).length < songPlace + 1)
                list += '\n' + 'Plus many more! too large to display them all!';
            break;
        }
            
    }
    // console.log(list.length);
    if(list.length < 1024 && list.length > 0)
    {
        let cEmbed = new Discord.MessageEmbed()
            .setColor("#9859B6")
            .setTimestamp()
            .addField("**Queue ** Page " + arg, list);
    
        return message.channel.send({embed: cEmbed});
    }

    if(list.length == 0)
    {
        return message.channel.send('Page ' + arg +' does not exist');
    }

    try{
        return message.channel.send('Kylerrrrrrr its brokennnnn :( but here it is all in plaintext just in case.\n\n' + list);
    }
    catch{
        return message.channel.send('Kylerrrrrrr its so broken');
    }
}