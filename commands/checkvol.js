const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
module.exports.help = {
    name: 'checkvol',
    description: 'Check Volume for !play function.',
    aliases: ['cv'],
    guildonly: true,
    cooldown: 3
}
module.exports.run = async (client, message, arg) => {   
    let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    message.channel.send("Volume is currently at " + content.volume);
}