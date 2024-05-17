import { AudioPlayer, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";

export interface SongProps {
    title: string,
    url: string
}

class AudioPlayerHandler {
    public player: AudioPlayer | undefined;
    public queue: Array<SongProps> = [];
    public positionInQueue: number = 0;

    public setAudioPlayer(newAudioPlayer: AudioPlayer) {
        this.player = newAudioPlayer;
    }

    public async enqueueAndPlay(songUrl: string) {
        if(await this.enqueue(songUrl)) {
            this.positionInQueue = this.queue.length - 1;
            console.log(this.positionInQueue);
            const stream = ytdl(songUrl, { filter : 'audioonly' });
            const resource = createAudioResource(stream);
            this.player!.play(resource);
        }
    }

    public async playNext() {
        const nextSong = this.queue[this.positionInQueue];
        const stream = ytdl(nextSong.url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        this.player!.play(resource);
        if (this.positionInQueue + 1 >= this.queue.length) {
            this.positionInQueue = this.queue.length - 1;
        } else {
            this.positionInQueue++;
        }
    }
    
    public getQueue(): Array<SongProps> {
        return this.queue;
    }

    public async enqueue(newUrl: string): Promise<boolean> {
        const isValidUrl = ytdl.validateURL(newUrl);
        if (!isValidUrl) {
            return false;
        }
        const info = await ytdl.getBasicInfo(newUrl);
        this.queue.push({
            title: info.videoDetails.title,
            url: newUrl
        });
        console.log(this.player?.state.status);
        if (this.player?.state.status == 'idle') {
            this.playNext();
        }
        return true
    }

    public dequeue() {
        this.queue.pop()
    }
    
    public clearQueue() {
        this.queue = []
    }

    public removeFromIndex(index: number) {
        this.queue.slice(index, 1);
    }
}

export const audioPlayerHandler = new AudioPlayerHandler();

