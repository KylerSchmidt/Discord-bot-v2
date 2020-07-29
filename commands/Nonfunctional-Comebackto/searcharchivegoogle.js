const google = require('google');
const Discord = require('discord.js');

module.exports.help = {
    name: 'searcharchivegoogle',
    description: 'Search on google for some information \n **Archived!** broken way of doing API.',
    args: true,
    usage: '<information to search>'
}

module.exports.run = async(client, message, args) => {
    if (args <= 0) return;
    google.resultsPerPage = 25;
    google(args, function (err, res) {
        if (err) return;
        console.log(res);
        console.log(res.links.length);
        if (res.links.length <= 0) return message.channel.send("Error or no results found (most likely error...)");
        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            if(!link.href) {
                res.next;
            } else {
                let embed = new Discord.RichEmbed()
                    .setColor('RANDOM')
                    .setAuthor(`Result "${suffix}"`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png')
                    .setDescription(`\n**Link:** [${link.title}](${link.href})\n**Information:**\n${link.description}`)
                    .setFooter('Google Search', message.author.displayAvatarURL);
                
                console.log(embed);
                message.channel.send({embed: embed});
                break;
            }
        }
        
        
    });
    
}
