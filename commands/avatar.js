module.exports.help = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'shows image of user'
}

module.exports.run = async (client, message, args) => {
    let msg = await message.channel.send("Generating avatar...");

    // If user is not specified, asume it is about themselves
    if(!message.mentions.users.size) {
        await message.channel.send({files: [
            {
                attachment: message.author.displayAvatarURL,
                name: "avatar.png"
            }
        ]});
    }
    else {
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL}`;
        });

        await message.channel.send(avatarList);
    }
    
    msg.delete();
}
