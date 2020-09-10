const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
module.exports.help = {
    name: 'stayinvoice',
    description: 'Keeps bot in the voice channel',
    aliases: ['siv'],
    guildonly: true,
    usage: '<0-1> or <true-false>'
}
module.exports.run = async (client, message, arg) => {
    var setInVoice;
    var truefalse = 0;
    if(arg[0] == "true" || arg[0] == "false")
    {
        setInVoice = (arg[0] == "true");
        truefalse = 1;
    }
    
    if(isNaN(setInVoice))
        message.channel.send("did not send proper data.")

    if(!truefalse)
        setInVoice = parseInt(arg[0]);
    let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    content.stayInChat = setInVoice;
    fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(content, null, 2));
    if(setInVoice)
        message.channel.send("Bot set to stay in voice channel");
    else
        message.channel.send("Bot set to leave voice channel");
}