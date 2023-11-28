import { Request, Response, NextFunction } from "express";
import CanvaService from "../services/canvaService";
const canvaService = new CanvaService();
export default class Canva {
  static canvaService = null;
  static COOKIE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  static CANVA_BASE_URL = "https://canva.com";
  async start(req: Request, res: Response, next: NextFunction){
    try {
      let [nonceWithExpiry, nonce] = await canvaService.start(Canva.COOKIE_EXPIRY_MS);
      res.cookie("nonce", nonceWithExpiry, {
        secure: true,
        httpOnly: true,
        maxAge: Canva.COOKIE_EXPIRY_MS,
        signed: true,
      });

      const params = new URLSearchParams({
        nonce,
        state: req?.query?.state?.toString() || "",
      });
      // res.json({response: `${Canva.CANVA_BASE_URL}/apps/configured?${params}`})

      res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configure/link?${params}`);

    } catch (error) {
      console.log(error);
      res.json({response: false})
    }
  }
// https://backend-shop-production.up.railway.app/configuration/start?state=w5hH69-MLjPM1VtJAk079zs5wOjrr98eeZYh09p9tP_JfIAWrQyH0y0LwN5Kr6iuBU4-G48KXNWMo9FtKJHJOdyVECXTEDdG1pOK3lhtqLP-zTEq6WzZ7UU2XBH7Pmrb6ZcN5Nc6FQBW1n6UfNdAMg5221pBwn-Z5WWdqKnfpvG7GYNHE5OdWe7r0RaXaOWcwWFB5BbP7_aFZmyQJBrdue5_fTP4gUsXpjMkGq-hmQ8Ur6Y0

// http://localhost:3001/canva/configuration/start?state=w5hH69-MLjPM1VtJAk079zs5wOjrr98eeZYh09p9tP_JfIAWrQyH0y0LwN5Kr6iuBU4-G48KXNWMo9FtKJHJOdyVECXTEDdG1pOK3lhtqLP-zTEq6WzZ7UU2XBH7Pmrb6ZcN5Nc6FQBW1n6UfNdAMg5221pBwn-Z5WWdqKnfpvG7GYNHE5OdWe7r0RaXaOWcwWFB5BbP7_aFZmyQJBrdue5_fTP4gUsXpjMkGq-hmQ8Ur6Y0
  async redirect(req: Request, res: Response, next: NextFunction){
    try {
      // const nonceQuery = req.query.nonce;
      console.log("Mis llaves autenticadas --> req.signedCookies --> ", req.signedCookies);

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
      res.clearCookie("nonce");

      let cookieNonce: string = "";
      let expiry: number = 0;

      try {
        [cookieNonce, expiry] = JSON.parse(cookieNonceAndExpiry);
      } catch (e) {
        // If the nonce can't be parsed, assume something has been compromised and exit.
        return failureResponse();
      }

      // If the nonces are empty, exit the authentication flow.
      if (
        this.isEmpty(cookieNonceAndExpiry) ||
        this.isEmpty(queryNonce) ||
        this.isEmpty(cookieNonce)
      ) {
        return failureResponse();
      }

      /**
       * Check that:
       *
       * - The nonce in the cookie and query parameter contain the same value
       * - The nonce has not expired
       *
       * **Note:** We could rely on the cookie expiry, but that is vulnerable to tampering
       * with the browser's time. This allows us to double-check based on server time.
       */
      if (expiry < Date.now() || cookieNonce !== queryNonce) {
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
      res.json({response: `${Canva.CANVA_BASE_URL}/apps/configured?${params}`})
      // res.redirect(302, `${Canva.CANVA_BASE_URL}/apps/configured?${params}`);

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
  private isEmpty(str?: string): boolean {
    return str == null || str.length == 0;
  }

  
}