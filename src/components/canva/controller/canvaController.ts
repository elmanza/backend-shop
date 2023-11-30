import { Request, Response, NextFunction } from "express";
import CanvaService from "../services/canvaService";
import HandlerDocument from "../../../utils/handlerDocument";
const canvaService = new CanvaService();
const db = new HandlerDocument({ users: [] });
export default class Canva {
  static canvaService = null;
  static COOKIE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  static CANVA_BASE_URL = "https://canva.com";
  

  async start(req: Request, res: Response, next: NextFunction){
    try {

      const stateParam: string = req?.query?.state?.toString() || "";
      let [nonceWithExpiry, nonce] = await canvaService.start(Canva.COOKIE_EXPIRY_MS);
      res.cookie("nonce", nonceWithExpiry, {
        secure: true,
        httpOnly: true,
        maxAge: Canva.COOKIE_EXPIRY_MS,
        signed: true,
      });

      const params = new URLSearchParams({
        nonce,
        state: stateParam,
      });

      res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configure/link?${params}`);
    } catch (error) {
      console.log(error);
      res.json({response: false})
    }
  }

  async redirect(req: Request, res: Response, next: NextFunction){
    try {
      console.log(" [ REDIRECT ] -> ", req.originalUrl);
      const failureResponse = () => {
        const params = new URLSearchParams({
          success: "false",
          state: req.query.state?.toString() || "",
        });
        res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configured?${params}`);
      };

      // Get the nonce and expiry time stored in the cookie.
      const cookieNonceAndExpiry = req.signedCookies.nonce;

      // Get the nonce from the query parameter.
      const queryNonce = req.query.nonce?.toString(); 

      // After reading the cookie, clear it. This forces abandoned auth flows to be restarted.
      // res.clearCookie("nonce");

      let cookieNonce: string = "";
      let expiry: number = 0;
      try {
        [cookieNonce, expiry] = JSON.parse(cookieNonceAndExpiry);
      } catch (e) {

        console.log("Error en mi try/catch", e);
        // If the nonce can't be parsed, assume something has been compromised and exit.
        return failureResponse();
      }

      // If the nonces are empty, exit the authentication flow.

      if (
        Date.now() > expiry || // The nonce has expired
        typeof cookieNonce !== "string" || // The nonce in the cookie is not a string
        typeof queryNonce !== "string" || // The nonce in the query parameter is not a string
        cookieNonce.length < 1 || // The nonce in the cookie is an empty string
        queryNonce.length < 1 || // The nonce in the query parameter is an empty string
        cookieNonce !== queryNonce // The nonce in the cookie does not match the nonce in the query parameter
      ) {
        return failureResponse();
      }

      // Get the user's ID from the query parameters
      const { user } = req.query;
      if (typeof user !== "string") {
        console.error(
          `user field in query parameters: expected 'string' but found '${typeof user}'`
        );
        res.status(400).send({});
        return;
      }

      // Load the database
      const data = await db.read();

      // Add the user to the database
      if (!data.users.filter( (_user: any) => _user.user === user).length) {
        data.users.push({
          tomi_access_token: req?.query?.tomi_access_token?.toString() || "",
          user
        });
        await db.write(data);
      }


      // Create query parameters for redirecting back to Canva
      const params = new URLSearchParams({
        success: "true",
        state: req?.query?.state?.toString() || ""
      });

      // Redirect the user back to Canva
      res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configured?${params}`);

    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction){
    try {
      // Load the database
      const data = await db.read();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async loginRender(req: Request, res: Response, next: NextFunction){
    try {
      res.render('login', { error: false, route: `/canva/login?${req.originalUrl.split("?")[1]}` });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction){
    try {
      const { username, password } = req.body;
      let response = await canvaService.login(username, password);
      if (response) {
        console.log("Auth Successfully -> [INFO]: ", {response});
        res.redirect(302, `/canva/redirect-url?tomi_access_token${response.access_token}&${req.originalUrl.split("?")[1]}`);
      } else {
        res.render('login', { error: true, route: `/canva/login?${req.originalUrl.split("?")[1]}` });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Checks if a given param is nullish or an empty string
   *
   * @param str The string to check
   * @returns true if the string is nullish or empty, false otherwise
   */
  isEmpty(str?: string): boolean {
    return str == null || str.length == 0;
  }

  
}