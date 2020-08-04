const Discord = module.require('discord.js');
module.exports.help = {
    name: 'queue',
    description: 'Display full song queue',
    aliases: ['q'],
    voiceonly: true,
    guildonly: true
}

module.exports.run = async(client, message, args) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is currently no queue.');
    var songPlace = 0;
    var num = 1;
    var list = '';
    for(song in serverQueue.songs)
    {
        list += '\n' + num + ": " + serverQueue.songs[songPlace].title + "\n" + serverQueue.songs[songPlace].url + "\n\n";
        num++;
        songPlace++;
    }
    let cEmbed = new Discord.MessageEmbed()
    .setColor("#9859B6")
    .setTimestamp()
    .addField("**Queue **", list);
    
    message.channel.send({embed: cEmbed});


}