module.exports.help = {
    name: 'sprinkler',
    description: 'MEH SPRINKLER GOES',
    cooldown: 5
}

// bot goes yeet
module.exports.run = async(client, message, args) => {
    message.channel.send(`My sprinkler goes like thisstststststststststststststststststststststststst and comes back like ttttttttttttttttt`, {
        tts: true
    });
}
