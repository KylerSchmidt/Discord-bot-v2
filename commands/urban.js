// Initalize
const color = require("../color.json");
const Discord = module.require('discord.js');
const urban = module.require("urban");

module.exports.help = {
    name: 'urban',
    description: 'urbanDictionary! Woooooooooo!',
    aliases: ['u'],
    args: true,
    usage: '<search>',
    cooldown: 3
}

// Pull information from urban dictionary 
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    let str = args.join(' ');

    await urban(str).first(json => {
        if(!json) return message.channel.send("No results could be found");
        let definition = json.definition;
        // There some weird [] around some words. These are hyperlinks. removed them.
        definition = definition.replace(/\[/g, '');
        definition = definition.replace(/\]/g, '');

        if(json.sound_urls <= 0) json.sound_urls = ["no sound file"];
        let cEmbed = new Discord.MessageEmbed()
            .setTitle(json.word)
            .setDescription(definition)
            .setColor(color.red)
            .addField("**Upvotes**", json.thumbs_up, true)
            .addField("**Downvotes**", json.thumbs_down, true)
            .addField("**Written on - **", json.written_on)
            .addField("**Link**", json.permalink)
            .addField("**Sound**", json.sound_urls);
        message.channel.send({embed: cEmbed})
    })

    msg.delete();
}