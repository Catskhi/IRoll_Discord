import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { audioPlayerHandler } from '../../handlers/AudioPlayerHandler';

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Join voice channel.')
    .addStringOption(option =>
        option.setName('url')
            .setDescription('The url of the song.')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const user_id = interaction.member!.user.id;
    const url: string = interaction.options.get('url')!.value as string
    const voice_channel_id = interaction.guild!.members.cache.get(user_id)?.voice.channelId;
    const voiceChannel = joinVoiceChannel({
        channelId: voice_channel_id as string,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild!.voiceAdapterCreator
    });
    voiceChannel.subscribe(audioPlayerHandler.player!);
    await audioPlayerHandler.enqueueAndPlay(url);
    interaction.reply(`Now playing: ${url}`);
}