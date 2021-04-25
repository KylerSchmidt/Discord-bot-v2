// Initalize
const Discord = module.require('discord.js');
const fetch = module.require('superagent');
const api = "https://meme-api.herokuapp.com/gimme";

module.exports.help = {
    name: 'memes',
    description: 'Dank bruh',
    aliases: ['m'],
    cooldown: 2
}

// gets a random meme from above api that draws from reddit
module.exports.run = async(client, message, args) => {
    let msg = await message.channel.send("Generating...");
    
    let { body } = await fetch.get(api);
    if(!{ body} ) return message.channel.send("Something broke. Try again.");
    if(body.postLink <= 0) body.postLink = ["missing link"];
    if(body.subreddit <= 0) body.subreddit = ["missing subreddit"];
    if(body.title <= 0) body.title = ["missing title"];
    if(body.url <= 0) body.url = ["http://www.commandercast.com/wp-content/uploads/2013/06/no_image_found.jpg"];
    let cEmbed = new Discord.MessageEmbed()
    .setAuthor("Dank Memes")
    .setColor("RANDOM")
    .addField("**Link - **", body.postLink)
    .addField("**From Subreddit - **", body.subreddit)
    .addField("**Title - **", `${body.title}\n`)
    .setImage(body.url)
    .setTimestamp();
    
    message.channel.send({embed: cEmbed});

    msg.delete();
}