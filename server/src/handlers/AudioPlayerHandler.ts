import { AudioPlayer, AudioResource, createAudioResource } from "@discordjs/voice";
import ytdl from "ytdl-core";

export interface SongProps {
    title: string,
    url: string
}

class AudioPlayerHandler {
    public player: AudioPlayer | undefined;
    public currentVolume: number = 100;
    public currentResource: AudioResource | null = null;
    public queue: Array<SongProps> = [];
    public positionInQueue: number = 0;
    public loopQueue: boolean = false;
    public loopTrack: boolean = false;

    public setAudioPlayer(newAudioPlayer: AudioPlayer) {
        this.player = newAudioPlayer;
    }

    public setVolume(newVolume: number) {
        this.currentVolume = newVolume;
        if (this.currentResource !== null) {
            console.log(`Volume: ${this.currentResource.volume}`)
            this.currentResource.volume?.setVolume(this.currentVolume);
        }
    }

    public async enqueueAndPlay(songUrl: string) {
        if(await this.enqueue(songUrl)) {
            this.positionInQueue = this.queue.length - 1;
            this.createResourceFromUrl(songUrl);
            this.player!.play(this.currentResource!);
        }
    }

    public playFromIndex(index: number) {
        this.positionInQueue = index;
        this.createResourceFromUrl(this.queue[index].url);
        this.player?.play(this.currentResource!);
        return this.queue[index].title;
    }

    public replayCurrentSong() {
        this.createResourceFromUrl(this.queue[this.positionInQueue].url);
        this.player!.play(this.currentResource!);
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
        this.createResourceFromUrl(nextSong.url);
        console.log(`Current resource: ${this.currentResource}`);
        this.player!.play(this.currentResource!);
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
        this.createResourceFromUrl(previousSong.url);
        this.player!.play(this.currentResource!);
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
        if (this.positionInQueue === index) {
            this.player?.stop();
            this.currentResource = null;
        }
        this.queue.splice(index, 1);
    }

    private createResourceFromUrl(url: string) {
        const stream = ytdl(url, { filter : 'audioonly' });
        this.currentResource = createAudioResource(stream, { inlineVolume: true });
    }
}

export const audioPlayerHandler = new AudioPlayerHandler();

