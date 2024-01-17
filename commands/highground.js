module.exports.help = {
    name: 'highground',
    aliases: ['hg'],
    description: 'The highground. Only for masters.',
    cooldown: 3
}

// Displays picture of obi-wan :)
module.exports.run = async(client, message, args) => {
    message.channel.send("https://d.ibtimes.co.uk/en/full/1399134/obi-wan-kenobi.jpg");
}

