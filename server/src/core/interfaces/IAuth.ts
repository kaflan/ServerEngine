import {RequestHandler} from "express";

export interface IAuth {
  initialize();
  generateToken(payload: typeof Object): string;
  isAuthenticated(): RequestHandler;
}
