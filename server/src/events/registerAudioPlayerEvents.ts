import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { audioPlayerHandler } from "../handlers/AudioPlayerHandler";

export default function registerAudioPlayerEvents(player: AudioPlayer) {
    player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
        console.log('Audio player is in the Idle state!');
        if (audioPlayerHandler.loopTrack) {
            audioPlayerHandler.replayCurrentSong();
            return;
        }
        if (audioPlayerHandler.queue.length > 0) {
            if (audioPlayerHandler.positionInQueue >= audioPlayerHandler.queue.length - 1) {
                if (audioPlayerHandler.loopQueue === false) {
                    console.log('There are no more songs on the queue.');
                    return;
                }
            }
            audioPlayerHandler.playNext();
        }
    });

    player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
        console.log('Audio player is in the Playing state!');
    });
}