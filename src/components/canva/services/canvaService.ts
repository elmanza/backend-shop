import * as crypto from "crypto";
import axios from "axios";
export default class CanvaService { 

  private HOST_LOGIN: string = 'https://api.gtw-wb.tomi.digital/v1/auth/login';
  async start(COOKIE_EXPIRY_MS: number = 0){
    const nonce = crypto.randomUUID();
    const expiry = Date.now() + COOKIE_EXPIRY_MS;
    return [JSON.stringify([nonce, expiry]), nonce];
  }

  async login(username: string, password: string){
    try {
      let response = await axios.post(`${this.HOST_LOGIN}`, {
        username,
        password
      });
      return response.data;
    } catch (error:any) {
      return false;
    }
    
  }
}