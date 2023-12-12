import { Request, Response, NextFunction } from "express";
import TypesenseService from "../services/canvaService";
const typesenseService = new TypesenseService();
export default class Typesense {

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      let { word } = req.params;
      let { page = 1 } = req.query
      const response = await typesenseService.search(word, Number(page));
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  
}