import { VoiceConnectionReadyState, getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current music.');

export async function execute(interaction: ChatInputCommandInteraction) {
    if (audioPlayerHandler.player) {
        audioPlayerHandler.player.pause();
        interaction.reply("Paused audio.");
    } else {
        interaction.reply("There is no audio playing");
    }
}