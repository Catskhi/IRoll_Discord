import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayer } from '@discordjs/voice';
import ytdl from 'ytdl-core';

export let player: AudioPlayer | undefined;

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
    player = createAudioPlayer();
    const stream = ytdl(url, { filter : 'audioonly' });
    const resource = createAudioResource(stream);
    player.play(resource);
    voiceChannel.subscribe(player);
    interaction.reply(`Now playing: ${url}`);
}