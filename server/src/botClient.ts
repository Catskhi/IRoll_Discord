import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { audioPlayerHandler } from './handlers/AudioPlayerHandler';
import { createAudioPlayer } from '@discordjs/voice';
import registerAudioPlayerEvents from './events/registerAudioPlayerEvents';

dotenv.config()

export const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
]});

export const startClient = async () => {
	client.commands = new Collection()
	const foldersPath = path.join(__dirname, 'commands')
	const commandFolders = fs.readdirSync(foldersPath)
	
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
	
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name,(...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
	
	audioPlayerHandler.setAudioPlayer(createAudioPlayer());
	registerAudioPlayerEvents(audioPlayerHandler.player!);
	
	console.log(`Token: ${process.env.DISCORD_TOKEN}`);
	await client.login(process.env.DISCORD_TOKEN);
}

