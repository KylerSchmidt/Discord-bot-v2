const fs = require('fs');
const path = require('path');
module.exports.help = {
    name: 'volume',
    description: 'Change Volume for !play function.',
    aliases: ['vol'],
    args: true,
    guildonly: true,
    voiceonly: true,
    cooldown: 3,
    usage: '<1-50>'
}

module.exports.run = async (client, message, arg) => {
    const volume = parseInt(arg[0])
    // Write to config.json file our new volume so its consistant between reboots
    let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
    content.volume = volume;
    fs.writeFileSync(path.resolve(__dirname, '../config.json'), JSON.stringify(content, null, 2));
    // Write volume into distube
    const queue = client.distube.getQueue(message);
    if (queue) {
        queue.setVolume(volume);
    }
    message.channel.send(`${client.emotes.success} | Volume set to \`${volume}\``);
}