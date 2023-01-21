// This code builds a bit of a custom built Client with added collection and map.
// This is specifically used for the musicbot portion of the bot.
const { Client, Collection, IntentsBitField} = require('discord.js');

const Intents = new IntentsBitField();
Intents.add(
	IntentsBitField.Flags.Guilds, 
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.MessageContent);

module.exports = class extends Client {
	constructor(config) {
		super({
			intents: Intents,
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;
	}
};