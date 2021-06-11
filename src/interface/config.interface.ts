/**
 * Service variable
 */
export interface EnvInterface {
  PORT: number;
  NODE_ENV: string;
}

/**
 * Database variable
 */
export interface DBInterface {
  MONGODB_URI: string;
  SESSION_SECRET: string;
}
