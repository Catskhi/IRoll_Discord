import { getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave voice channel.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const connection = getVoiceConnection(interaction.guildId as string);
    if (!connection) {
        interaction.reply(`You're not in a voice channel.`);
        return;
    }
    connection?.destroy();
    interaction.reply('Left voice channel.');
}