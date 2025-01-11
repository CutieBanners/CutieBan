import { Server } from 'socket.io';
import http from 'http';

export class SocketService {
  private io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinProject", (projectId: string) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joining Project: ${projectId}`);
      });

      socket.on("leaveProject", (projectId: string) => {
        socket.leave(projectId);
        console.log(`User ${socket.id} leaving Project: ${projectId}`);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  public notifyProjectChange(projectId: string) {
    this.io.to(projectId).emit("projectUpdated");
  }
}