// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://quotes.rest/qod.json";

module.exports.help = {
    name: 'quote',
    description: 'Pulls quote of the day',
    aliases: ['qod'],
    cooldown: 3
}

// Pulls a random quote from above api.
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    let { body } = await fetch.get(api).catch(error => {
        msg.delete();
        return message.channel.send("Trouble grabbing quote. perhaps API has been called too much?");
    });
    // console.log(body);
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    //if(body.error.message != null) return message.channel.send(body.error.message);
    let qod = body.contents.quotes[0];
    let cEmbed = new Discord.EmbedBuilder()
        .setColor("Random")
        .addFields(
            {name: '**Author**', value: qod.author},
            {name: '**Quote**', value: qod.quote},
            {name: '**Tags**', value: qod.tags.toString()},
            {name: '**Link**', value: qod.permalink},
            )
        .setFooter({text: body.copyright.url})
        .setTimestamp();
    
    message.channel.send({embeds: [cEmbed]});

    msg.delete();
}