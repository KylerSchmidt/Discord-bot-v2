// Initalize
const config = module.require('../config.json');
const color = module.require('../color.json');
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
let api = "https://api.openweathermap.org/data/2.5/weather?appid=";

module.exports.help = {
    name: 'weatherzip',
    description: 'find out the weather in your area',
    aliases: ['wz'],
    args: true,
    usage: '<City Zip Code>',
    cooldown: 3
}

// Pulls information about the weather from api
module.exports.run = async(client, message, args) => {
    // if no arguements
    if(args <= 0) return;
    // parse in from config.json
    api = api + config.weatherapi + '&units=' + config.weatherunits + '&zip=';
    // convert args to string and make one large sentance to search
    args = String(args).replace(' ','');
    // args = args + ',US';
    let msg = await message.channel.send("Generating...");
    let newapi = api + args; 
    let { body } = await fetch.get(newapi).catch(error => {
        msg.delete();
        return message.channel.send("Could not find city");
    });
    if(body === undefined) return;
    
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    let cEmbed = new Discord.MessageEmbed()
        .setColor(color.green)
        .setAuthor(`${body.name}`)
        .addField("**Conditions**", `Currently ${body.weather[0].main}`)
        .addField('**Tempuratures**', `Temp: ${body.main.temp} \nMin: ${body.main.temp_min} \nMax: ${body.main.temp_max}`)
        .setTimestamp()
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}