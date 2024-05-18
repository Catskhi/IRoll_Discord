import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes a song from queue.')
        .addIntegerOption(option => 
            option.setName('position')
                .setDescription('The index of the song to be removed')
                .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const index = interaction.options.get('position')!.value as number - 1;
    const removedSong = audioPlayerHandler.queue[index];
    audioPlayerHandler.removeFromIndex(index);
    interaction.reply(`Removed: ${removedSong.title}, on position: ${index + 1}`);
}