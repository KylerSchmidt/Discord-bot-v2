const Discord = module.require('discord.js');
module.exports.help = {
    name: 'queue',
    description: 'Display first 10 songs in the queue',
    aliases: ['q'],
    voiceonly: true,
    guildonly: true
}

module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is currently no queue.');
    var songPlace = 0;
    var list = '';
    for(songPlace in serverQueue.songs)
    {
        console.log('i got in here');
        list += '\n' + songPlace + ": " + serverQueue.songs[songPlace].title + "\n" + serverQueue.songs[songPlace].url;
        if (serverQueue.songs[songPlace].isLive)
            list += "\n**Note: song above is live **";
        list += "\n\n"
        songPlace++;
        if (songPlace > 8)
        {
            list += '\n' + 'Plus many more! too large to display them all!';
            break;
        }
            
    }
    console.log(list.length);
    if(list.length < 1024)
    {
        let cEmbed = new Discord.MessageEmbed()
            .setColor("#9859B6")
            .setTimestamp()
            .addField("**Queue **", list);
    
        return message.channel.send({embed: cEmbed});
    }
    // else
    // {
        
    //     return message.channel.send("Queue very large. Heres it all in plaintext.\n" + list);
    // }
    
}