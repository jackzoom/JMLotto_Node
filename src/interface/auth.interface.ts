import { Response } from "express";

export interface JwtAuthResponse extends Response {
  authUser: {
    userId?: string;
  };
}
