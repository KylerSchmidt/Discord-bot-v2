// Initalize
const color = module.require('../color.json');
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://randomuselessfact.appspot.com/random.json?language=en";

module.exports.help = {
    name: 'facts',
    description: 'get a random fact from the internet. Useful? idk... maybe...',
    aliases: ['f']
}

// Pulls a random fact from above api 
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    
    let { body } = await fetch.get(api);
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    var fact = body.text;
    console.log(fact);
    let cEmbed = new Discord.MessageEmbed()
        .setAuthor("Dank Facts")
        .setColor(color.green)
        .addField(fact, "10/10 would fact again.")
        .addField('**Link **', body.permalink)
        .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}