/**
 * Service variable
 */
export interface EnvInterface {
  /**
   * Server Port
   */
  PORT: number;
  /**
   * Node Env Mode
   */
  NODE_ENV: string;
}

/**
 * Database variable
 */
export interface DBInterface {
  /**
   * MongoDB connect url
   * @example mongodb://xxx
   */
  MONGODB_URI: string;
  /**
   * MongoDB session secret
   */
  SESSION_SECRET: string;
}

interface NumberDictionary {
  [index: number]: string;
}

let a: NumberDictionary = {};
