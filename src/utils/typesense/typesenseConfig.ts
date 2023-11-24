// typesenseConfig.ts

import { Client } from 'typesense';

// typesenseConfig.ts

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
      host: 'uvb6mphijcn1s20zp-1.a1.typesense.net', // localhost
      port: 443,      // 8108
      protocol: 'https',  // HTTP
    },
  ],
  apiKey: 'TWvyWCeXHRcyTceMyooF5PHkuXXf9i49', // Reemplaza esto con tu clave de API de Typesense
};

const typesenseClient = new Client(typesenseConfig);
export default typesenseClient;