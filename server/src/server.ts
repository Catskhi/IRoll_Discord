import express, { Request, Response } from 'express';
import { audioPlayerHandler } from './handlers/AudioPlayerHandler';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hi');
})

app.post('/pause', (req: Request, res: Response) => {
    audioPlayerHandler.player?.pause();
    res.send('Paused song');
})

export const startApp = () => {
    app.listen(port, () => {
        console.log(`Access server on: http://localhost:${port}`);
    })
}