const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports.help = {
    name: 'stayinvoice',
    description: 'Keeps bot in the voice channel',
    aliases: ['siv'],
    guildonly: true,
    usage: '<0-1> or <true-false>. Toggleable.'
}

module.exports.run = async (client, message, arg) => {
    var setInVoice;
    var truefalse = 0;
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if(arg[0] == "true" || arg[0] == "false")
    {
        setInVoice = (arg[0] == "true");
        truefalse = 1;
    }

    if(!truefalse)
        setInVoice = parseInt(arg[0]);

    let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    if(isNaN(setInVoice))
    {
        if(content.stayInChat)
            content.stayInChat = false;
        else
            content.stayInChat = true;
    }
    else
        content.stayInChat = setInVoice;
    fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(content, null, 2));
    if(content.stayInChat)
        message.channel.send("Bot set to stay in voice channel");
    else
    {
        //No queue of any kind? might as well leave.
        if(typeof(serverQueue) == 'undefined')
        {
            try{voiceChannel.leave();}
            catch{}
        }
        message.channel.send("Bot set to leave voice channel");
    }
}