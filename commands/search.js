// Initalize
const color = module.require('../color.json');
const config = require("../config.json");
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
let api = "https://www.googleapis.com/customsearch/v1?key=";

module.exports.help = {
    name: 'search',
    description: 'google search... yeah... it searches google...',
    aliases: ['s'],
    todo: 'Perhaps a way to search for the next element?',
    args: true,
    cooldown: 5,
    usage: '<what to search for>'
}

// Google search via customsearch api
module.exports.run = async(client, message, args) => {
    // if no arguements
    if(args <= 0) return;
    // parse for config.json
    api = api + config.googleapi + '&cx=' + config.googleSearchID + '&q=';
    // convert args to string and make one large sentance to search
    args = String(args).replace(',',' ');
    let msg = await message.channel.send("Generating...");
    let newapi = api + args; 
    let { body } = await fetch.get(newapi);
    //console.log(body.items[1]);
    

    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    if(body.searchInformation.totalResults == 0) {
        msg.delete();
        return message.channel.send('something broke or no results found');
    } 
    if(body.items[1]['title'] <= 0) body.items[1]['title'] = ['no title'];
    let cEmbed = new Discord.EmbedBuilder()
        .setColor(color.green)
        .addFields(
            {name: '**', value: body.items[1]['title']},
            {name:'**Link **', value: body.items[1]['link'] },
            {name: '**Description: **', value: body.items[1]['snippet']}
            )
        // .addField('**Link **', body.items[1]['link'])
        // .addField('**Description: **', body.items[1]['snippet'])
        .setTimestamp()
    
    message.channel.send({embeds: [cEmbed]});

    msg.delete();
}