import { VoiceConnection } from "@discordjs/voice";


class ConnectionHandler {
    currentConnection: VoiceConnection | undefined;

    public getCurrentConnection() {
        return this.currentConnection;
    }

    public setCurrentConnection(newConnection: VoiceConnection) {
        this.currentConnection = newConnection;
    }
}

export const connectionHandler = new ConnectionHandler();