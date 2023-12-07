import { Client } from 'typesense';
import { typesense } from "../../config" ;
export interface TypesenseConfig {
  nodes: {
    host: string;
    port: number;
    protocol: 'http' | 'https';
  }[];
  apiKey: string;
}

const typesenseConfig: TypesenseConfig = {
  nodes: [
    {
      host: typesense.host,
      port: typesense.port,
      protocol: 'https',
    },
  ],
  apiKey: typesense.api_key,
};

const typesenseClient = new Client(typesenseConfig);
export default typesenseClient;