// Initalize
const config = require("./config.json");
const err = require('./error.js');
const Discord = require("discord.js");
// Struct. for client saved in client.js
const clientLink = require('./client.js');
// http server creation
const http = require('http');
let arrayLog = [];
// Definitions from config.json
const prefix = config.botPrefix;
const token = config.discordToken;
// create a discord client
const client = new clientLink();
client.commands = new Discord.Collection();


// // Http setup for sever command input
// const serverHttp = http.createServer(function (req, res) {
//     if(req.url === '/') {
//         res.write('Discord Bot v2');
//         for(let i = 0; i < arrayLog.length; i++)
//         {
//             res.write('\n' + arrayLog[i]);
//         }
//         res.end();
//     }
// }).listen(8080);


//Initalize file service. read through folder commands and grab.
const fs = require("fs");
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
    console.log(`\nStartup completed. ${client.user.username}\n`);
    // console.log(client.commands);
    // gives in console the link to where to add this bot to a server.
    client.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    }).catch(err => {
        console.log(err.stack);
    });
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
client.on("message", async message => {
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
	
    // send to file if command exists
	if(commandSend) commandSend.run(client, message, argsArr);
	// run through any possible error messages. stored in error.js
	err.errors(client, message, argsArr, commandName, commandSend, prefix);
    // log who called what to console
    let log;
    if(message.channel.type !== 'text') {
        log = `${message.author.username} called - ${message.content} - DM`;
    } else {
        log = `${message.author.username} called - ${message.content} - ${message.guild.name}`;
    }
    console.log(log);
    arrayLog.push(log);
});

client.on("error", async () => {
    console.log("Client Error Thrown.")
})

// Login to server w/dis bot given
client.login(token);