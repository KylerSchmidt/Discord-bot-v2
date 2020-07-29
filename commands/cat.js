// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "http://aws.random.cat/meow";

module.exports.help = {
    name: 'cat',
    description: 'Meow!',
    aliases: ['c']
}

// Pulls cat picture from above api randomly
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    let { body } = {}
    try{
        body = await fetch.get(api);
    // catch any problems with api in general. give user the problem.
    }catch(e){
        console.log("Something very much broke.\n" + e + "\n\n");
        msg.delete();
        return message.channel.send("Service unavailable.");
    }

    if(!{ body} ) return message.channel.send("Something broke on bots side. Try again.");

    let cEmbed = new Discord.MessageEmbed()
    .setAuthor("Dank Cat")
    .setColor("#9859B6")
    .setImage(body.body.file)
    .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}