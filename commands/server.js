const color = module.require('../color.json');
const Discord = module.require("discord.js");

module.exports.help = {
    name: 'server',
    description: 'Gives general server information',
    guildonly: true,
    cooldown: 3
}

// Displays server information
module.exports.run = async(client, message, args) => {
    // build general information about server bot is running on.
    let owner = await message.guild.fetchOwner();
    let sEmbed = new Discord.EmbedBuilder()
    .setColor(color.yellow)
    .setTitle("Server Info")
    .setThumbnail(message.guild.iconURL())
    .setAuthor({name: `${message.guild.name} Info`, iconURL: message.guild.iconURL()})
    .addFields(
        {name: "**Guild Name: **", value: `${message.guild.name}`, inline: true},
        {name: "**Guild Owner: **", value: `${owner.user.username}`, inline: true},
        {name: "**Member Count: **", value: `${message.guild.memberCount}`, inline: true}
    )
    .setFooter({text: "Discordbot v2.5", iconURL: client.user.displayAvatarURL()});
    message.channel.send({embeds: [sEmbed]});
}

