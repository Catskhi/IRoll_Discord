import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loop related commands.')
    .addSubcommand(subcommand => 
        subcommand
            .setName('track')
            .setDescription('Loop current track'))
    .addSubcommand(subcommand => 
        subcommand
            .setName('queue')
            .setDescription('Loop the queue.'));

export async function execute(interaction: ChatInputCommandInteraction) {
    if (audioPlayerHandler.queue.length == 0) {
        interaction.reply("There are no tracks on queue.");
        return;
    }
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'track') {
        audioPlayerHandler.loopQueue = false;
        audioPlayerHandler.loopTrack = true;
        if (audioPlayerHandler.player?.state.status != 'playing') {
            audioPlayerHandler.replayCurrentSong();
        }
        interaction.reply('Looping current track.');
    } else if (subcommand === 'queue') {
        audioPlayerHandler.loopQueue = true;
        audioPlayerHandler.loopTrack = false;
        interaction.reply('Looping queue');
    }
}