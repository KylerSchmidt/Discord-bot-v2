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
    let sEmbed = new Discord.MessageEmbed()
    .setColor(color.yellow)
    .setTitle("Server Info")
    .setThumbnail(message.guild.iconURL)
    .setAuthor(`${message.guild.name} Info`, message.guild.iconURL)
    .addField("**Guild Name: **", `${message.guild.name}`, true)
    .addField("**Guild Owner: **", `${message.guild.owner}`, true)
    .addField("**Member Count: **", `${message.guild.memberCount}`, true)
    .setFooter("Discordbot v2.5", client.user.displayAvatarURL);
    message.channel.send({embed: sEmbed});
}

