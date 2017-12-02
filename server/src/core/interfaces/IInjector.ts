import {Permissions} from "../permissions/Permissions";
import {Auth} from "../Auth";
import {Sequelize} from "sequelize-typescript";
import Database from "../Database";
import {ExpressServer} from "../ExpressServer";
import {IConfig} from "./ISettings";
import Configurator from "../Configurator";
import {Logger} from "../Logger";

export interface IInjector {
  logger: Logger;
  permissions: Permissions;
  auth: Auth;
  sequelize: Sequelize;
  database: Database;
  expressServer: ExpressServer;
  settings: IConfig;
  configurator: Configurator;
}
