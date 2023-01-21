const Discord = module.require('discord.js');
module.exports.help = {
    name: 'bulkdelete',
    description: 'destroys a list of messages',
    guildonly: true,
    aliases: ['delete', 'bd'],
    admin: true,
    args: true,
    usage: '<amount 1 to 50>',
    cooldown: 5
}

// Deletes an amount of messages based on what is given
module.exports.run = async(client, message, args) => {
    const amount = parseInt(args[0]) + 1;
    
	if (amount < 2 || amount > 51) {
		return message.reply("you need to input a number between 2 and 50.");
    }
    
    try {
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send("error in attempt to delete.");
        });
    } catch (e) {
    }
};