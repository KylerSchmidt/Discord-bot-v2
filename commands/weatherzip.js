// Initalize
const config = module.require('../config.json');
const color = module.require('../color.json');
const Discord = module.require('discord.js');
const fetch = module.require('superagent');


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
    let api = "https://api.openweathermap.org/data/2.5/weather?appid=";
    api = api + config.weatherapi + '&units=' + config.weatherunits + '&zip=';
    // convert args to string and make one large sentance to search
    let newargs = String(args).replace(' ','');
    // args = args + ',US';
    let msg = await message.channel.send("Generating...");
    let newapi = api + newargs; 
    let { body } = await fetch.get(newapi).catch(error => {
        msg.delete();
        console.log(newapi);
        return message.channel.send("Could not find city");
    });
    if(body === undefined) return;
    
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    let cEmbed = new Discord.EmbedBuilder()
        .setColor(color.green)
        .setAuthor({name: `${body.name}`})
        .addFields(
            {name: "**Conditions**", value: `Currently ${body.weather[0].main}`},
            {name: '**Tempuratures**', value: `Temp: ${body.main.temp} \nMin: ${body.main.temp_min} \nMax: ${body.main.temp_max}`},
        )
        .setTimestamp()
    
    message.channel.send({embeds: [cEmbed]});

    msg.delete();
}