module.exports.help = {
    name: 'pause',
    description: 'Toggle pause music from !play',
    guildonly: true,
    cooldown: 5
}
module.exports.run = async (client, message, args) => {
    // Update current song real time.
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return console.log("serverqueue empty");
    if(serverQueue.paused)  
    {
        serverQueue.dispatcher.resume();
        serverQueue.paused = false;
    }
    else 
    {
        serverQueue.dispatcher.pause();
        serverQueue.paused = true;
    }                   
        
}