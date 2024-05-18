import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the volume.')
    .addIntegerOption(option => 
        option.setName('level')
            .setDescription('The level of the volume.')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(100));

export async function execute(interaction: ChatInputCommandInteraction) {
    const newVolume = interaction.options.get('level')!.value as number;
    if (audioPlayerHandler.currentResource === null) {
        interaction.reply(`There is no sound playing now.`);
        return;
    }
    audioPlayerHandler.setVolume(newVolume / 100);
    interaction.reply(`Changed volume to: ${newVolume}`);
}