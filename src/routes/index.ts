
import { Express, Request, Response, NextFunction } from "express";
import AuthAPI from '../components/auth';


export default (app: Express) => {

  AuthAPI(app);
  app.get('/', (req: Request, res: Response, next: NextFunction)=>{
    res.send('Server On!');
  })

}