// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://cataas.com/cat?json=true";
const apiurl = "https://cataas.com/cat/";

module.exports.help = {
    name: 'cat',
    description: 'Meow!',
    aliases: ['c'],
    cooldown: 2
}

// Pulls cat picture from above api randomly
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    let { body } = {}
    try{
        body = await fetch.get(api);
    // catch any problems with api in general. give user the problem.
    }catch(e){
        // console.log("Something very much broke.\n" + e + "\n\n");
        msg.delete();
        return message.channel.send("Service unavailable.");
    }

    if(!{ body} ) return message.channel.send("Something broke on bots side. Try again.");

    // console.log(body._body._id);
    let cEmbed = new Discord.EmbedBuilder()
    .setAuthor({name: "Dank Cat"})
    .setColor("#9859B6")
    .setImage(apiurl + body._body._id)
    .setTimestamp()
    
    message.channel.send({embeds: [cEmbed]});

    msg.delete();
}