// Initalize
const color = module.require('../color.json');
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://evilinsult.com/generate_insult.php?lang=en&type=json";

module.exports.help = {
    name: 'insult',
    aliases: ['i'],
    description: 'Yeah? well ur a.... fuk.'
}

// generates a random insult based off of api
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    
    let body = await fetch.get(api);
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    // turns out text was the given.
    // then we must JSON parse the actual matteral we want to use.
    var insult = body.text;
    var obj = JSON.parse(insult);
    let cEmbed = new Discord.MessageEmbed()
        .setAuthor("Dank Insult")
        .setColor(color.green)
        .addField(obj.insult, "You got Rekt")
        // .addField('**Link **', body.permalink)
        .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}