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
        uEmbed = new Discord.EmbedBuilder()
            .setThumbnail(message.author.displayAvatarURL())
            .setAuthor({name: `${message.author.username} Info`, iconURL: message.author.displayAvatarURL()})
            .setColor(color.lime)
            .addFields(
                {name: "**ID: **", value: message.author.id.toString()},
                {name: "**Created At: **", value: message.author.createdAt.toString()},
                )
            // .addField("**Created At: **", message.author.createdAt)
            .setFooter({text: "Discordbot v2.5", iconURL: client.user.displayAvatarURL()});
    } else {
        const avatarList = message.mentions.users.map(user => {
            uEmbed = new Discord.EmbedBuilder()
                .setThumbnail(user.displayAvatarURL())
                .setAuthor({name: `${user.username} Info`, iconURL: user.displayAvatarURL()})
                .setColor(color.lime)
                .addFields(
                    {name: "**ID: **", value: user.id.toString()},
                    {name: "**Created At: **", value: user.createdAt.toString()},
                    )
                .setFooter({text: "Discordbot v2.5", iconURL: user.displayAvatarURL()});
        });
    }
    await message.channel.send({embeds: [uEmbed]});
    msg.delete();
}

