import { Router, Express } from "express";
import Typesense from "./controller/typesenseController";

export default (app: Express) => {
  let typesense = new Typesense();
  const rt: Router = Router();
  app.use('/_typesense', rt);
  rt.get("/search/:word", typesense.search);
  
}