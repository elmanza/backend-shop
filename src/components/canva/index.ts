import { Router, Express } from "express";
import basicAuth from "express-basic-auth";
import Canva from "./controller/canvaController";

import { getTokenFromQueryString } from "../../utils/jwt_middleware/jwt_middleware";
import { createJwtMiddleware } from "../../utils/jwt_middleware";

const APP_ID = 'AAF0HNITXzs';
const jwtMiddleware = createJwtMiddleware(APP_ID);
export default (app: Express) => {
  let canva = new Canva();
  const rt: Router = Router();
  app.use('/canva', rt);

  rt.get('/configuration/start', canva.start);
  rt.get('/login-canva', canva.loginRender);
  rt.post('/login', canva.login);
  rt.get('/redirect-url', createJwtMiddleware(APP_ID, getTokenFromQueryString), canva.redirect);
  rt.post('/authentication/status', jwtMiddleware, canva.getAuthenticationStatus);
  rt.get('/getusers', canva.getAllUsers);
  
}