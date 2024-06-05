import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { audioPlayerHandler } from './handlers/AudioPlayerHandler';
import voice_routes from './routes/voice';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/voice', voice_routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hi');
})

io.on('connection', (socket) => {
    console.log(`A user connected!`);
    audioPlayerHandler.emitCurrentState();
})

export const startApp = () => {
    server.listen(port, () => {
        console.log(`Access server on: http://localhost:${port}`);
    })
}

export { io };