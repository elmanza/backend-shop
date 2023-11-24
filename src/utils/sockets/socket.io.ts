import { Server as SocketIO, Socket as SocketIOClientSocket } from "socket.io";
import { Server } from "http";

export default class Socket {
  private static instancia: Socket | undefined;
  io?: SocketIO;

  constructor(http: Server) {
    if (Socket.instancia) {
      return Socket.instancia;
    }
    Socket.instancia = this;
    this.io = new SocketIO(http);
    this.init();
  }

  init(): void {
    try {
      this.io!.on("connection", (socket: SocketIOClientSocket) => {
        console.log("Nuevo usuario conectado!");
      });
    } catch (error) {
      console.log(" /utils/sockets/socket.io ~~ Line 12 ~~ Error En el init");
      console.log(error);
    }
  }
}





