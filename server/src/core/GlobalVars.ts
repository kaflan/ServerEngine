import {Sequelize} from "sequelize-typescript";
import {IConfig} from "./interfaces/ISettings";
import {ExpressServer} from "./ExpressServer";
import Configurator from "./Configurator";
import Database from "./Database";
import {Auth} from "./Auth";
import {Permissions} from "./modules/permissions/Permissions";

interface GlobalVars {
  permissions: Permissions,
  auth: Auth,
  sequelize: Sequelize,
  database: Database,
  expressServer: ExpressServer,
  settings: IConfig,
  configurator: Configurator
}
export let globalVars: GlobalVars = {
  permissions: null,
  auth: null,
  sequelize: null,
  database: null,
  expressServer: null,
  settings: null,
  configurator: null
};
export default globalVars;


