import { AudioPlayer, AudioPlayerError, AudioPlayerStatus } from "@discordjs/voice";
import { audioPlayerHandler } from "../handlers/AudioPlayerHandler";
import { io } from "../server";

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
                    audioPlayerHandler.emitCurrentState();
                    return;
                }
            }
            audioPlayerHandler.playNext();
        }
    });

    player.on(AudioPlayerStatus.Paused, (oldState, newState) => {
        console.log('Audio player is in the Paused state!');
        audioPlayerHandler.emitCurrentState();
    })

    player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
        console.log('Audio player is in the Playing state!');
        audioPlayerHandler.emitCurrentState();
    });

    player.on('error', error => {
        console.log(`An error occurred on audio player: ${error.message}`);
    })
}