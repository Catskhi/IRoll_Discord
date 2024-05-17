import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a song to queue.')
    .addStringOption(option => 
        option.setName('url')
            .setDescription('The url of the song.')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const songUrl = interaction.options.get('url')!.value as string;
    if (await audioPlayerHandler.enqueue(songUrl)) {
        interaction.reply('Added song to queue.');
    } else {
        interaction.reply('Invalid youtube url.');
    }
}