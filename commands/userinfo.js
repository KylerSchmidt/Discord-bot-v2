// Initalize
const color = module.require("../color.json");
const Discord = module.require("discord.js");

module.exports.help = {
    name: "userinfo",
    aliases: ['ui'],
    description: "displays users basic information",
    cooldown: 3
}

// Display userinformation
module.exports.run = async (client, message, args) => {
    const msg = await message.channel.send("retreving...");
    let uEmbed;
    // If user not specified, asume it is on themselves
    if(!message.mentions.users.size) {
        uEmbed = new Discord.MessageEmbed()
            .setThumbnail(message.author.displayAvatarURL)
            .setAuthor(`${message.author.username} Info`, message.author.displayAvatarURL)
            .setColor(color.lime)
            .addField("**ID: **", message.author.id)
            .addField("**Created At: **", message.author.createdAt)
            .setFooter("Discordbot v2.5", client.user.displayAvatarURL);
    } else {
        const avatarList = message.mentions.users.map(user => {
            uEmbed = new Discord.MessageEmbed()
                .setThumbnail(user.displayAvatarURL)
                .setAuthor(`${user.username} Info`, user.displayAvatarURL)
                .setColor(color.lime)
                .addField("**ID: **", user.id)
                .addField("**Created At: **", user.createdAt)
                .setFooter("Discordbot v2.5", user.displayAvatarURL);
        });
    }
    await message.channel.send({embed: uEmbed});
    msg.delete();
}

