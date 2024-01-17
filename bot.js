// Initalize
const config = require("./config.json");
const err = require('./error.js');
const Discord = require("discord.js");

// Struct. for client saved in client.js
const clientLink = require('./client.js');

let arrayLog = [];
// Definitions from config.json
const prefix = config.botPrefix;
const token = config.discordToken;
// create a discord client
const client = new clientLink();
client.commands = new Discord.Collection();
client.emotes = config.emoji;

// distube creation
const { distube, DisTube } = require("distube");
// const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');


// bind DisTube to client
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SoundCloudPlugin()],
})

// cooldowns storage.
const cooldowns = new Discord.Collection();

//Initalize file service. read through folder commands and grab.
const fs = require("fs");
const path = require('path');
fs.readdir("./commands/", (err, files) => {
    // fs error. if this hits then something is very wrong.
    if(err) console.error(err);

	// Only want .js files
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) return console.log("no commands found!");
	console.log(`${jsfiles.length} commands found!`);
	
	// Load in the files
	jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        client.commands.set(props.help.name, props);
    });
});

process.on('SIGINT', function() {
	console.log("SIGINT detected. Shutting down.");
	process.exit(0);
});

// Bot Init
client.on("ready", async () => {
    // pass distube saved volume
    console.log(`\nStartup completed. ${client.user.username}\n`);
    // console.log(client.commands);
    // gives in console the link to where to add this bot to a server.
    // client.generateInvite(["ADMINISTRATOR"]).then(link => {
    //     console.log(link);
    // }).catch(err => {
    //     console.log(err.stack);
    // });
})
    .on('error', console.error);

// Bot disconnect
client.on("disconnect", async () => {
	console.log("disconnected from server! attempt to reconnect...");
});

// Bot reconnect
client.on("reconnecting", async () => {
	// console.log("reconnecting to server...");
});

// Bot sees message
client.on("messageCreate", async message => {
    // If message came from a bot or does not start with ! ignore. 
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    // split up message to send to file.
    const argsArr = message.content.slice(prefix.length).split(/ +/);
    const commandName = argsArr.shift().toLowerCase();
    const commandSend = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
    
    // Are there commands?
    if(!commandSend) return;
    
    // run through any possible error messages. stored in error.js
    // returns 1 if error. 0 if no error.
	const errorCheck = err.errors(client, message, argsArr, commandName, commandSend, cooldowns, prefix);

    // send to file if command exists
	if(commandSend && !errorCheck) commandSend.run(client, message, argsArr);
	
    // log who called what to console
    let log;
    if(message.channel.type !== 'text') {
        log = `${message.author.username} called - ${message.content} - DM`;
    } else {
        log = `${message.author.username} called - ${message.content} - ${message.guild.name}`;
    }
    if(errorCheck)
        log += `\n\t\t${message.author.username} called with error return`;
    console.log(log);
    arrayLog.push(log);
});

client.on("error", async () => {
    console.log("Client Error Thrown.")
})

client.distube
    .on('error', (channel, e) => {
        if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
        else console.error(e)
    })
    .on("playSong", (queue, song) => {
        let content = JSON.parse(fs.readFileSync(path.resolve(__dirname, './config.json'), 'utf8'));
        queue.setVolume(content.volume);
        queue.textChannel.send("NOW PLAYING **" + song.name + `**\nSong is playing at volume \`${content.volume}\``)
    })
    .on('addSong', (queue, song) =>
        queue.textChannel.send(`${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send(`${client.emotes.success} | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue`)
  )
    .on('searchNoResult', (message, query) =>
        message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
    )
// Login to server w/dis bot given
client.login(token);