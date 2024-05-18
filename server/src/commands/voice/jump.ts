import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
    .setName('jump')
    .setDescription('Loop related commands.')
    .addIntegerOption(option => 
        option.setName('position')
            .setDescription('Jump to a specific track in the queue by position.')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    if (!member.voice.channel) {
        interaction.reply("You need to be in a voice channel to use this command.");
        return;
    }
    const index = interaction.options.get('position')!.value as number;
    if (index > audioPlayerHandler.queue.length || index < 0) {
        interaction.reply('Invalid queue index.');
        return;
    }
    const currentSong = audioPlayerHandler.playFromIndex(index - 1);
    interaction.reply(`Now playing: ${currentSong}`);
}