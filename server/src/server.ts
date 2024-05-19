import express, { Request, Response } from 'express';
import { audioPlayerHandler } from './handlers/AudioPlayerHandler';
import voice_routes from './routes/voice';

const app = express();
const port = 3000;

app.use('/voice', voice_routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hi');
})

export const startApp = () => {
    app.listen(port, () => {
        console.log(`Access server on: http://localhost:${port}`);
    })
}