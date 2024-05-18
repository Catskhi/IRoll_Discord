import { AudioPlayer, AudioResource, createAudioResource } from "@discordjs/voice";
import { create } from "domain";
import ytdl from "ytdl-core";

export interface SongProps {
    title: string,
    url: string
}

class AudioPlayerHandler {
    public player: AudioPlayer | undefined;
    public currentResource: AudioResource | null = null;;
    public queue: Array<SongProps> = [];
    public positionInQueue: number = 0;
    public loopQueue: boolean = false;
    public loopTrack: boolean = false;

    public setAudioPlayer(newAudioPlayer: AudioPlayer) {
        this.player = newAudioPlayer;
    }

    public async enqueueAndPlay(songUrl: string) {
        if(await this.enqueue(songUrl)) {
            this.positionInQueue = this.queue.length - 1;
            console.log(this.positionInQueue);
            const stream = ytdl(songUrl, { filter : 'audioonly' });
            this.currentResource = createAudioResource(stream);
            this.player!.play(this.currentResource);
        }
    }

    public playFromIndex(index: number) {
        const stream = ytdl(this.queue[index].url, { filter: 'audioonly' });
        this.currentResource = createAudioResource(stream);
        this.player?.play(this.currentResource);
        return this.queue[index].title;
    }

    public replayCurrentSong() {
        const stream = ytdl(this.queue[this.positionInQueue].url, { filter: 'audioonly' });
        this.currentResource = createAudioResource(stream);
        this.player!.play(this.currentResource);
    }

    public async playNext() {
        console.log(`Jumping, position ${this.positionInQueue}`);
        if (this.positionInQueue + 1 >= this.queue.length) {
            if (this.loopQueue) {
                this.positionInQueue = 0;
            } else {
                this.positionInQueue = this.queue.length - 1;
            }
        } else {
            this.positionInQueue++;
        }
        const nextSong = this.queue[this.positionInQueue];
        const stream = ytdl(nextSong.url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        this.player!.play(resource);
    }

    public async playPrevious() {
        console.log(`Backing, position ${this.positionInQueue}`);
        if (this.positionInQueue - 1 < 0) {
            if (this.loopQueue) {
                this.positionInQueue = this.queue.length - 1;
            } else {
                this.positionInQueue = 0;
            }
        } else {
            this.positionInQueue--;
        }
        const previousSong = this.queue[this.positionInQueue];
        const stream = ytdl(previousSong.url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        this.player!.play(resource);
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
        if (this.player?.state.status == 'idle') {
            this.playNext();
        }
        return true
    }

    public dequeue() {
        this.queue.pop()
    }
    
    public clearQueue() {
        this.queue = [];
        this.currentResource = null;
        this.player?.stop();
    }

    public removeFromIndex(index: number) {
        this.queue.slice(index, 1);
    }
}

export const audioPlayerHandler = new AudioPlayerHandler();

