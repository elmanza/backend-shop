import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8080
}

export const typesense = {
  api_key: process.env.TYPESENSE_API_KEY || "",
  host: process.env.TYPESENSE_HOST || "",
  port: Number(process.env.TYPESENSE_PORT) || 443
}