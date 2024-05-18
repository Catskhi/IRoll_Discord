import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";
import { joinVoiceChannel } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a song to queue.')
    .addStringOption(option => 
        option.setName('url')
            .setDescription('The url of the song.')
            .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const songUrl = interaction.options.get('url')!.value as string;
    const user_id = interaction.member!.user.id;
    const voice_channel_id = interaction.guild!.members.cache.get(user_id)?.voice.channelId;
    const voiceChannel = joinVoiceChannel({
        channelId: voice_channel_id as string,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild!.voiceAdapterCreator
    });
    voiceChannel.subscribe(audioPlayerHandler.player!);
    if (await audioPlayerHandler.enqueue(songUrl)) {
        interaction.reply('Added song to queue.');
    } else {
        interaction.reply('Invalid youtube url.');
    }
}