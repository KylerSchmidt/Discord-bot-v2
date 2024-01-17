module.exports.help = {
    name: 'queue',
    description: 'Display first 10 songs in the queue',
    aliases: ['q'],
    usage: '<page number>',
    voiceonly: true,
    cooldown: 5,
    guildonly: true
}

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing playing!`)
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    message.channel.send(`${client.emotes.queue} | **Server Queue**\n${q}`)
}
