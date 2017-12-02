import {RequestHandler} from "express";

export interface IRouter {
  routes: Array<RouteOptions>;
  register(options: RouteOptions);
}

export interface RouteOptions extends Object {
  path: string;
  method: EMethods;
  handler: RequestHandler;
  isProtected?: boolean;
  permissions?: Array<string> | string;
  resourceName?: string;
}

export enum EMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}
