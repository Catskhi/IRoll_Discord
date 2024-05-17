import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";


export const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the audio.');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (audioPlayerHandler.player) {
        audioPlayerHandler.player.unpause();
        interaction.reply("Resumed song.");
    } else {
        interaction.reply("There is no audio playing");
    }
}