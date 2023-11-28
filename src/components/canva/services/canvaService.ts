import * as crypto from "crypto";
export default class CanvaService { 
  async start(COOKIE_EXPIRY_MS: number = 0){
    const nonce = crypto.randomUUID();
    const expiry = Date.now() + COOKIE_EXPIRY_MS;
    return [JSON.stringify([nonce, expiry]), nonce];
  }
}