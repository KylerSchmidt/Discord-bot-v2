module.exports.help = {
    name: 'ping',
    description: 'Pong!'
}

// PONG!
module.exports.run = async(client, message, args) => {
    message.channel.send(`Pong.`, {
        tts: true
    });
}

