import { Request, Response, NextFunction } from "express";
import CanvaService from "../services/canvaService";
const canvaService = new CanvaService();
export default class Canva {
  static canvaService = null;
  static COOKIE_EXPIRY_MS = 60 * 60 * 1000; // 5 minutes
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

      const failureResponse = () => {
        const params = new URLSearchParams({
          success: "false",
          state: req.query.state?.toString() || "",
        });
        // res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configured?${params}`);
        res.json({response: `${Canva.CANVA_BASE_URL}/apps/configured?${params}`})
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

      console.log("---------------------------");
      console.log({
        cookieNonceAndExpiry,
        queryNonce,
        cookieNonce
      })

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

      // Create query parameters for redirecting back to Canva
      const params = new URLSearchParams({
        success: "true",
        state: req?.query?.state?.toString() || "",
      });

      // Redirect the user back to Canva
      res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configured?${params}`);
      // res.json({response: `${Canva.CANVA_BASE_URL}/apps/configured?${params}`})

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