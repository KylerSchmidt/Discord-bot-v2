const color = module.require('../color.json');
const Discord = module.require('discord.js');
const fetch = module.require('snekfetch');
const api = "http://webknox.com:8080/jokes/random?maxLength=100&apiKey=d9be7a5af9msh1a22a33b6241347p18bde2jsn2aca52b3d317";

module.exports.help = {
    name: 'jokes',
    description: 'get a random joke from the internet. lul.'
}

module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    
    let { body } = await fetch.get(api);
    console.log(body);
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    let cEmbed = new Discord.RichEmbed()
        .setAuthor("Dank Jokes")
        //.setColor(color.green)
        .addField(body.joke)
        .addField('**Category:**', body.category)
        .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}