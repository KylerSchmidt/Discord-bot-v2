module.exports.help = {
    name: 'resume',
    description: 'Resume music from !play',
    guildonly: true,
    cooldown: 5
}
module.exports.run = async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    if (queue.paused) {
      queue.resume()
      return message.channel.send('Resumed the song for you :)')
    } else {
        message.channel.send('The queue is not paused!')
      }
}