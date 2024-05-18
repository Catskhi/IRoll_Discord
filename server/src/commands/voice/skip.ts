import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
        .setName("skip")
        .setDescription('Skip to next song.');

export async function execute(interaction: ChatInputCommandInteraction) {
    audioPlayerHandler.playNext();
    interaction.reply('Skipped song.');
}