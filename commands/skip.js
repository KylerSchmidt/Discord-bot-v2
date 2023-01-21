module.exports.help = {
    name: 'skip',
    description: 'Skip song in playlist of songs added via !play',
    voiceonly: true,
    guildonly: true,
    cooldown: 2
}

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    try {
      const song = await queue.skip()
      message.channel.send(`${client.emotes.success} | Skipped! Now playing:\n${song.name}`)
    } catch (e) {
      message.channel.send(`${client.emotes.error} | ${e}`)
    }
}