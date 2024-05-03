import { Client, Collection, CommandInteraction, Events, GatewayIntentBits, Interaction, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]});

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
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

client.on('messageCreate', async (message) => {
  if (message.content === 'ping') {
    message.reply('Pong!')
  }
})

console.log(`Token: ${process.env.DISCORD_TOKEN}`)
client.login(process.env.DISCORD_TOKEN);