const { CommandInteractionOptionResolver } = require("discord.js");

// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://meme-api.com/gimme";

module.exports.help = {
    name: 'memes',
    description: 'Dank bruh',
    aliases: ['m'],
    cooldown: 2
}

// gets a random meme from above api that draws from reddit
module.exports.run = async (client, message, args) => {
    let msg = await message.channel.send("Generating...");

    await fetch.get(api).then(function (body) {


        if (!{ body }) return message.channel.send("Something broke. Try again.");
        if (body.postLink <= 0) body.postLink = ["missing link"];
        if (body.subreddit <= 0) body.subreddit = ["missing subreddit"];
        if (body.title <= 0) body.title = ["missing title"];
        if (body.url <= 0) body.url = ["http://www.commandercast.com/wp-content/uploads/2013/06/no_image_found.jpg"];

        let cEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: "Dank Memes" })
            .setColor("Random")
            .addFields(
                { name: "**Link - **", value: body.postLink },
                { name: "**From Subreddit - **", value: body.subreddit },
                { name: "**Title - **", value: `${body.title}\n` },
            )
            .setImage(body.url)
            .setTimestamp();

        message.channel.send({ embeds: [cEmbed] });

        msg.delete();
    }).catch(function (response) {
        msg.delete();
        console.log(response);
        message.channel.send("Unable to generate meme :(");
    });;
}