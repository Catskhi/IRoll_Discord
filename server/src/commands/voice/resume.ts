import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { player } from "./play";


export const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the audio.');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (player) {
        player.unpause();
        interaction.reply("Resumed song.");
    } else {
        interaction.reply("There is no audio playing");
    }
}