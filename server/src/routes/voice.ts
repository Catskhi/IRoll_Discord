import { NextFunction, Request, Response, Router } from "express";
import { audioPlayerHandler } from "../handlers/AudioPlayerHandler";
import { client } from "../botClient";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { io } from "../server";
import { connectionHandler } from "../handlers/connectionHandler";

export const router = Router();

const verifyPlayer = (req: Request, res: Response, next: NextFunction) => {
    if (!audioPlayerHandler.player) {
        return res.status(500).send({
            error: `There is no current audio player.`
        });
    }
    next();
}

router.use(verifyPlayer);

router.get('/', (req: Request, res: Response) => {
    res.send('Home page of voice');
})

router.post('/play', async (req: Request, res: Response) => {
    const songUrl: string | undefined = req.body.songUrl;
    const channelId: string | undefined = req.body.channelId;
    if (!songUrl || !channelId) {
        return res.status(400).send({
            message: 'You must set a song url and a channel id.'
        });
    }
    try {
        const channel = await client.channels.fetch(channelId);

        if (!channel || !channel.isVoiceBased()) {
            return res.status(400).send({
                message: 'The provided channel ID does not correspond to a voice channel'
            });
        }

        
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        connectionHandler.setCurrentConnection(connection);
        for (const [guildId, guild] of client.guilds.cache) {
            if (guildId !== channel.guild.id) {
                const voiceConnection = getVoiceConnection(guildId);
                if (voiceConnection) {
                    voiceConnection.destroy();
                    audioPlayerHandler.clearQueue();
                }
            }
        }

        connectionHandler.currentConnection?.subscribe(audioPlayerHandler.player!);
        await audioPlayerHandler.enqueueAndPlay(songUrl);
        const queue = audioPlayerHandler.getQueue();
        io.emit('play-song', queue[queue.length - 1]);

        res.status(200).send('Joined the voice channel and playing the song');
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'An error occurred while trying to join the voice channel.'
        });
    }
})

router.post('/playFromIndex', (req: Request, res: Response) => {
    const index: number | undefined = req.body.index;
    if (index === undefined) {
        return res.status(400).send({
            message: "You must provide an index"
        });
    }
    try {
        if (connectionHandler.getCurrentConnection() == undefined) {
            return res.status(400).send({
                message: "The bot must be connected to a voice channel"
            });
        }
        audioPlayerHandler.playFromIndex(index!);
    } catch (error) {
        console.log(error);
    }
})

router.post('/removeFromIndex', (req: Request, res: Response) => {
    const index: number | undefined = req.body.index;
    if (index === undefined) {
        return res.status(400).send({
            message: "You must provide an index"
        });
    }
    try {
        if (connectionHandler.getCurrentConnection() == undefined) {
            return res.status(400).send({
                message: "The bot must be connected to a voice channel"
            });
        }
        audioPlayerHandler.removeFromIndex(index!);
    } catch (error) {
        console.log(error);
    }
})

router.post('/loop', (req: Request, res: Response) => {
    const option: 'queue' | 'track' | undefined = req.body.option;
    if (option === undefined) {
        return res.status(400).send({
            message: "You must provide a valid option"
        });
    }
    try {
        audioPlayerHandler.loop(option);
        return res.status(200).send({
            message: 'Changed loop'
        });
    } catch (error) {
        console.log(error);
    }  
})

router.post('/disableLoop', (req: Request, res: Response) => {
    try {
        audioPlayerHandler.disableLoop();
        return res.status(200).send({
            message: 'Disabled loop'
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/pause', (req: Request, res: Response) => {
    audioPlayerHandler.player?.pause();
    return res.status(200).send({
        message: 'Paused audio'
    });
})

router.post('/resume', (req: Request, res: Response) => {
    audioPlayerHandler.player?.unpause();
    return res.status(200).send({
        message: 'Resumed audio'
    });
})

router.post('/skip', (req: Request, res: Response) => {
    audioPlayerHandler.playNext();
    return res.status(200).send({
        message: "Playing next song"
    });
})

router.post('/back', (req: Request, res: Response) => {
    audioPlayerHandler.playPrevious();
    return res.status(200).send({
        message: "Playing previous song"
    });
})

router.post('/volume/:volume', (req: Request, res: Response) => {
    const newVolume: number = parseInt(req.params.volume);
    if (isNaN(parseInt(req.params.volume)) || newVolume < 0 || newVolume > 100) {
        return res.status(400).send({
            error: "The volume must be a number between 0 and 100"
        })
    }
    audioPlayerHandler.setVolume(newVolume);
    res.status(200).send({
        message: `Changed volume to ${newVolume}`
    })
})

export default router;