import { NextFunction, Request, Response, Router } from "express";
import { audioPlayerHandler } from "../handlers/AudioPlayerHandler";

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