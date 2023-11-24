import { Router, Express, Request, Response, NextFunction } from "express";


export default (app: Express) => {
  const rt: Router = Router();
  app.use('/auth', rt);

  rt.get('/', (req: Request, res: Response, next: NextFunction)=>{
    res.send('Work`s from Auth Component!');
  })

}