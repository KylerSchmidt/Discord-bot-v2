// This code builds a bit of a custom built Client with added collection and map.
// This is specifically used for the musicbot portion of the bot.
const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;
	}
};