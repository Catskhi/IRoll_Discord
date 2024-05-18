import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { audioPlayerHandler } from "../../handlers/AudioPlayerHandler";

export const data = new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Returns the queue.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const queue = audioPlayerHandler.getQueue();
    if (queue.length < 1) {
        interaction.reply("The queue is empty");
    } else {
        let songList: string = queue.map((song, index) => `${index + 1} - ${song.title}`).join('\n')
        interaction.reply(`Queue: \n${"`" + songList + "`"}`);
    }
}