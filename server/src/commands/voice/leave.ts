import { getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave voice channel.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const connection = getVoiceConnection(interaction.guildId as string);
    if (!connection) {
        interaction.reply(`You're not in a voice channel.`);
        return;
    }
    audioPlayerHandler.player?.off;
    audioPlayerHandler.clearQueue();
    connection?.destroy();
    interaction.reply('Left voice channel.');
}