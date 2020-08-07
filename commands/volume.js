const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
module.exports.help = {
    name: 'volume',
    description: 'Change Volume for !play function.',
    aliases: ['vol'],
    args: true,
    guildonly: true,
    usage: '<1-10>'
}
module.exports.run = async (client, message, arg) => {
    const setvol = parseInt(arg[0]);    
    if(setvol < 1 || setvol > 10)
        return message.reply("you need to input a number between 1 and 10.");
    let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    content.volume = setvol;
    fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(content, null, 2));
    message.channel.send("Volume set to " + content.volume);
    // Update current song real time.
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return console.log("serverqueue empty");
    serverQueue.dispatcher.pause(true);
    serverQueue.dispatcher.setVolume(setvol / 40);
    serverQueue.dispatcher.resume();
}