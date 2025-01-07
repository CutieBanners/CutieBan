import { io, Socket } from "socket.io-client";
import * as process from "node:process";

export class ProjectWebSocketService {
    private socket: Socket;
    private projectId: string | null = null;
    public onProjectUpdated: (data: any) => void = () => {};

    constructor() {
        this.socket = io(process.env.SERVER_WS_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 20,
            reconnectionDelay: 500,
        });

        this.socket.on("projectUpdated", (data) => {
            console.log("Project updated via WebSocket", data);
            this.onProjectUpdated(data);
        });

        this.socket.on("reconnect", () => {
            console.log("Reconnected to server.");
            if (this.projectId) {
                // Rejoin the last project room after reconnect
                this.joinProject(this.projectId);
            }
        });

        this.socket.on("reconnect_failed", () => {
            console.error("Failed to reconnect to the server.");
        });

        this.socket.on("connect_error", (error) => {
            console.error("Connection error: ", error);
        });
    }

    joinProject(projectId: string): void {
        console.log("Joining project:", projectId);
        if (this.projectId !== projectId) {
            if (this.projectId) {
                this.leaveProject(this.projectId);
            }
            this.socket.emit("joinProject", projectId);
            this.projectId = projectId;
        }
    }

    private leaveProject(projectId: string): void {
        console.log("Leaving project:", projectId);
        this.socket.emit("leaveProject", projectId);
        this.projectId = null;
    }
}
