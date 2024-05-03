import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('pong')
    .setDescription('Replies with Pongers!');

export async function execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!');
}