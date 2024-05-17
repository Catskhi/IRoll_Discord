import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
        .setName("clear")
        .setDescription('Clear the queue.');

export async function execute(interaction: ChatInputCommandInteraction) {
    audioPlayerHandler.clearQueue();
    interaction.reply('Cleared the queue.');
}