import express, { Express, Request, Response, NextFunction } from "express";
import cors from 'cors';
import { Server } from "http";
import { config } from "./config";
import serverRoutes from "./routes";
import Socket from "./utils/sockets/socket.io";
import path from "path";
import cookieParser from "cookie-parser";

// Extender el tipo de Request para incluir la propiedad socketManager
declare module "express" {
  interface Request {
    socketManager?: Socket;
  }
}

class App {
  app: Express;
  httpServer: Server | null;
  socket: any;
  constructor(){
    this.httpServer = null;
    this.socket = null;
    this.app = express();
    this.middlewares();
    this.settings();
    this.views();
    this.sockets();
    this.router();
  }

  settings(){
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.static(path.resolve(__dirname, 'public')));
    this.app.use(cookieParser("secretCanva"));
  }

  views(){
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");
  }

  middlewares(){
    this.app.use(cors());
  }

  sockets(){
    this.httpServer = new Server(this.app);
    this.socket = new Socket(this.httpServer);
  }

  router(){
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      req.socketManager = this.socket;
      next();
    });
    serverRoutes(this.app);
  }

  listen(){
    this.httpServer!.listen(config.port, ()=>{console.log(`http://localhost:${config.port}`)});
  }
}

new App().listen();