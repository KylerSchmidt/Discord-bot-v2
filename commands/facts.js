// Initalize
const color = module.require('../color.json');
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://uselessfacts.jsph.pl/random.json?language=en";

module.exports.help = {
    name: 'facts',
    description: 'get a random fact from the internet. Useful? idk... maybe...',
    aliases: ['f'],
    cooldown: 3
}

// Pulls a random fact from above api 
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    
    let { body } = {};
    try{
        body = await fetch.get(api);
    }catch(e){
        console.log("Something very much broke.\n" + e + "\n\n");
        msg.delete();
        return message.channel.send("Service unavailable.");
    }
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    var fact = body.body.text;
    var permalink = body.body.permalink;
    if (fact.length >= 256)
    {
        message.channel.send("Fact too big, heres what it is:\n" + fact);
    }
    else 
    {
    let cEmbed = new Discord.MessageEmbed()
        // .setAuthor("Dank Facts")
        .setColor(color.green)
        .addField("Dank Facts", fact)
        .addField('**Link **', permalink)
        .setTimestamp()

    message.channel.send({embed: cEmbed});
    }
    msg.delete();
}