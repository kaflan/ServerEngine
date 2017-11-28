import * as path from "path";
import logger from "./Logger";
import globalVars from "./GlobalVars";
import * as fs from "fs-extra";
import {RequestHandler} from "express";

export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

interface RouteOptions extends Object {
  path: string;
  method: Methods;
  handler: RequestHandler;
  isProtected?: boolean;
}

export class Router {
  private _routes: Array<RouteOptions> = [];
  get routes() {
    return this._routes;
  }

  constructor(private basePath = '/', routes: Array<RouteOptions> = []) {
    routes.forEach(item => this.register(item));
  }

  public static register(options: RouteOptions) {
    logger.info(`Route registered: ${options.method} - ${options.path}`);
    if (options.isProtected) {
      globalVars.expressServer.app[options.method](options.path, globalVars.auth.isAuthenticated(), options.handler);
    } else {
      globalVars.expressServer.app[options.method](options.path, options.handler);
    }
  }

  public static async injectModuleRouters(modulesPath) {
    let files = await fs.readdir(modulesPath);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let fileStat = await fs.stat(path.join(modulesPath, file));
      if (fileStat.isDirectory()) {
        await Router.injectModuleRouters(path.join(modulesPath, file));
      }
      if (path.extname(file) !== '.js' ||  !~file.indexOf('router')) {
        continue;
      }
      require(path.join(modulesPath, file));
    }
  }

  public register(options: RouteOptions) {
    let localOptions = Object.assign({}, options);
    localOptions.path = path.join(this.basePath, localOptions.path);
    Router.register(localOptions);
    this._routes.push(localOptions);
  }
}
