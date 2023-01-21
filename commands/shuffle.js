module.exports.help = {
    name: 'shuffle',
    description: 'Shuffle songs in playlist',
    guildonly: true,
    voiceonly: true,
    cooldown: 5
}

module.exports.run = async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    queue.shuffle()
    message.channel.send('Shuffled songs in the queue')
}