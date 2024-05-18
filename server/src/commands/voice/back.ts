import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
        .setName("back")
        .setDescription('Skip to previous song.');

export async function execute(interaction: ChatInputCommandInteraction) {
    audioPlayerHandler.playPrevious();
    interaction.reply('Skipped song.');
}