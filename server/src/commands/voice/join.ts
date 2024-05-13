import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join your voice channel.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.member!.user.id;
    const voice_channel_id = interaction.guild!.members.cache.get(user_id)?.voice.channelId;
    if (!voice_channel_id) {
        interaction.reply("You must be on a voice channel to use this command.");
        return;
    }
    const voiceChannel = joinVoiceChannel({
        channelId: voice_channel_id as string,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild!.voiceAdapterCreator
    });
    interaction.reply('Joined voice channel.')
}