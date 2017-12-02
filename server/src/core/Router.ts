import * as path from "path";
import globalVars, {default as Injector} from "./Injector";
import * as fs from "fs-extra";
import {IRouter, EMethods, RouteOptions} from "./interfaces/IRouter";

export const Methods = EMethods;

export class Router implements IRouter {
  private _routes: Array<RouteOptions> = [];
  get routes() {
    return this._routes;
  }

  constructor(private resourceName, private basePath = '/', routes: Array<RouteOptions> = []) {
    routes.forEach(item => this.register(item));
  }

  /**
   * Function to register route in the Express app
   * Can be used to add route without Router instance
   * @param {RouteOptions} options
   * @returns {any}
   */
  public static register(options: RouteOptions) {
    Injector.logger.info(`Route registered: ${options.method} - ${options.path}`);
    if (options.permissions) {
      globalVars.expressServer.app[options.method](options.path, globalVars.auth.isAuthenticated(), globalVars.permissions.checkAccess(options.resourceName, options.permissions), options.handler);
    }
    if (options.isProtected) {
      return globalVars.expressServer.app[options.method](options.path, globalVars.auth.isAuthenticated(), options.handler);
    }
    globalVars.expressServer.app[options.method](options.path, options.handler);
  }

  /**
   * Function to find all router files
   * Can recursive search
   * Files should be in format "example.router.ts"
   * @param modulesPath
   * @returns {Promise<void>}
   */
  public static async injectModuleRouters(modulesPath) {
    let files = await fs.readdir(modulesPath);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let fileStat = await fs.stat(path.join(modulesPath, file));
      if (fileStat.isDirectory()) {
        await Router.injectModuleRouters(path.join(modulesPath, file));
      }
      if (path.extname(file) !== '.js' || !~file.indexOf('router')) {
        continue;
      }
      require(path.join(modulesPath, file));
    }
  }

  /**
   * Function to add new route to Router instance
   * @param {RouteOptions} options
   */
  public register(options: RouteOptions) {
    let localOptions = Object.assign({}, options);
    localOptions.path = path.join(this.basePath, localOptions.path);
    localOptions.resourceName = localOptions.resourceName || this.resourceName;
    Router.register(localOptions);
    this._routes.push(localOptions);
  }
}
