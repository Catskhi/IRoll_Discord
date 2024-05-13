import { VoiceConnectionReadyState, getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { player } from "./play";

export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current music.');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (player) {
        player.pause();
        interaction.reply("Paused audio.");
    } else {
        interaction.reply("There is no audio playing");
    }
}