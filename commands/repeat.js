module.exports.help = {
    name: 'repeat',
    description: 'repeat current song from !play',
    guildonly: true,
    cooldown: 3
}
module.exports.run = async (client, message, args) => {
    // Update current song real time.
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return console.log("serverqueue empty");
    if(serverQueue.repeat)
    {
        serverQueue.repeat = false;
        return message.channel.send("Song repeat is turned off");
    } 
    else 
    {
        serverQueue.repeat = true;
        return message.channel.send("Song repeat is turned on");
    }
}