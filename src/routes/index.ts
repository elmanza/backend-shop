
import { Express, Request, Response, NextFunction } from "express";
import AuthAPI from '../components/auth';
import CanvaAPI from '../components/canva';


export default (app: Express) => {

  AuthAPI(app);
  CanvaAPI(app);
  app.get('/', (req: Request, res: Response, next: NextFunction)=>{
    res.send('Server On!');
  })

}