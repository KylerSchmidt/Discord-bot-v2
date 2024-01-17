const config = require("../config.json");
module.exports.help = {
    name: 'play',
    description: 'Play a song from youtube.',
    aliases: ['p'],
    args: true,
    guildonly: true,
    voiceonly: true,
    cooldown: 3,
    usage: '<youtube link>'
}

module.exports.run = async (client, message, arg) => {
    client.distube.play(message.member.voice.channel, arg.toString(), {
        member: message.member,
        textChannel: message.channel,
        message
    }).catch(err => {
        if(err.message.localeCompare("Unknown Playlist") == 0) message.reply(err.message + " **is this a mix? Cannot add a mix youtube autogenerates.**");
        message.reply(err.message);
	});
}