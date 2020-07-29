// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "http://dog.ceo/api/breeds/image/random";

module.exports.help = {
    name: 'dog',
    description: 'Woof!',
    aliases: ['d']
}
 
// Pulls dog picture from api randomly
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    
    let { body } = await fetch.get(api);
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    
    let cEmbed = new Discord.MessageEmbed()
    .setAuthor("Dank Dog")
    .setColor("#9859B6")
    .setImage(body.message)
    .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}