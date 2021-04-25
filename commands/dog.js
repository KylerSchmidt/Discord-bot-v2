// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "http://dog.ceo/api/breeds/image/random";

module.exports.help = {
    name: 'dog',
    description: 'Woof!',
    aliases: ['d'],
    cooldown: 2
}
 
// Pulls dog picture from api randomly
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
    // console.log(body.body);
    let cEmbed = new Discord.MessageEmbed()
    .setAuthor("Dank Dog")
    .setColor("#9859B6")
    .setImage(body.body.message)
    .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}