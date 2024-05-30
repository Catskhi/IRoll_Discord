import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { audioPlayerHandler } from './handlers/AudioPlayerHandler';
import voice_routes from './routes/voice';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/voice', voice_routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hi');
})

export const startApp = () => {
    app.listen(port, () => {
        console.log(`Access server on: http://localhost:${port}`);
    })
}