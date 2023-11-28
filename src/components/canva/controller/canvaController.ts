import { Request, Response, NextFunction } from "express";
import CanvaService from "../services/canvaService";
const canvaService = new CanvaService();
export default class Canva {
  static canvaService = null;
  static COOKIE_EXPIRY_MS = 60 * 60 * 1000; // 5 minutes
  static CANVA_BASE_URL = "https://canva.com";

  // example : canva/configuration/start?user=ASHTGpv-oqkfdrkDbEaB2UxgbHf2lSlx-rQpkr27u4c%3D&brand=ASHTGpu7ZK1edWZ60fsNDbEL1kwSmimJALkK-Ft78wI%3D&time=1701192163&extensions=API_NEXT&state=NHZIS2OcXbfj-z_tsHslcF92PQUHRm_k3_eni5O40yliP4a0taWhXZFuxcVBFxm060TWFk0qUcXQnNp8lKHdThoK5SuPzRwSzo49x90YE4UPa6mn4y9IBNFlBeDKUe89KUApzUjTTCKoXhHinemZ0CF_8IV2iU_Zlwtytg4LMtREia5f93jJczPS3bhu1bdhaNMi7hfljeBylu_T-tPNgaeVGQcmBUIC_40yqZTZa__k8KUW&canva_user_token=eyJraWQiOiI0ZDA3ZDMxZi1lYjFlLTRmMTQtODBlYy1jZDg4MWRlYmVkOTAiLCJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDExOTIxNjMsIm5iZiI6MTcwMTE5MjE2MywiZXhwIjoxNzAxMTkyNDYzLCJhdWQiOiJBQUYwSE5JVFh6cyIsInVzZXJJZCI6IkFTSFRHcHYtb3FrZmRya0RiRWFCMlV4Z2JIZjJsU2x4LXJRcGtyMjd1NGM9IiwiYnJhbmRJZCI6IkFTSFRHcHU3WksxZWRXWjYwZnNORGJFTDFrd1NtaW1KQUxrSy1GdDc4d0k9In0.lbz_iOBqqgmFYQPPoURNfQrB4unoYXpU_yAcFDqultw0FlkCOKQ-h9PAGWeDfXkc77HqWFeQb0rztEIYH_Bp4ooke4xpWzT3i_lu8EriQ40ga4WIyGSAxxRwZzewxyq3KuJRWQHpwtiOklL28Vasj4lvZ8gqyg1Gs7PIY0x7KTuNKQEM978_sTDCAPXInyv2w8aJLaEnxZ5DjMrdRWKj6lSWbYDm-krVZdlyM75Var5nBLY1QiLB2EsS86wFbLO5U2QMUrjn4fLJEr_WCikPNC4Q7esGxVGeLKEPMSUxeaSCSUH2CKNoX4iivmBwfZFQMe_ff4Cauj2nLC4tyyOnjQ&signatures=a96fcba2e15e5763a6b96d1fb89fc59a12c0a5c87262e98db6d959ab95facd8a&nonce=24aa9efd-48a6-4e41-ae8c-902e36e3f531

  // https://www.canva.com/apps/configure/link?nonce=2f05f75b-5540-4dc7-92f5-3b29480e391f&state=NHZIS2OcXbfj-z_tsHslcF92PQUHRm_k3_eni5O40yliP4a0taWhXZFuxcVBFxm060TWFk0qUcXQnNp8lKHdThoK5SuPzRwSzo49x90YE4UPa6mn4y9IBNFlBeDKUe89KUApzUjTTCKoXhHinemZ0CF_8IV2iU_Zlwtytg4LMtREia5f93jJczPS3bhu1bdhaNMi7hfljeBylu_T-tPNgaeVGQcmBUIC_40yqZTZa__k8KUW
  async start(req: Request, res: Response, next: NextFunction){
    try {
      // const { state } = req.query;
      const stateParam: string = req?.query?.state?.toString() || "";

      console.log({stateParam});
      let [nonceWithExpiry, nonce] = await canvaService.start(Canva.COOKIE_EXPIRY_MS);
      res.cookie("nonce", nonceWithExpiry, {
        secure: true,
        httpOnly: true,
        maxAge: Canva.COOKIE_EXPIRY_MS,
        signed: true,
      });

      const params = new URLSearchParams({
        success: "true",
        nonce,
        state: stateParam,
      });
      // res.json({response: `${Canva.CANVA_BASE_URL}/apps/configured?${params}`})
      console.log("Desde mi endpoint [start] -> ", `https://www.canva.com/apps/configure/link?${params}`);
      res.redirect(302, `https://www.canva.com/apps/configure/link?${params}`);

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

      console.log("Información de la solicitud: --> ", {
        method: req.method,
        originalUrl: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers,
      });

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