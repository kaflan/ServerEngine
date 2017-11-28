import * as path from "path";

declare function require(name: string);
require('source-map-support').install();

import Settings from "./core/Settings";
import {IConfig} from "./core/interfaces/ISettings";
import Configurator from "./core/Configurator";
import {globalVars} from "./core/GlobalVars";
import Database from "./core/Database";
import {ExpressServer} from "./core/ExpressServer";
import {Auth} from "./core/Auth";
import {Permissions} from "./core/modules/permissions/Permissions";
import {applyAcl} from "./permissions";

(async function () {
  try {
    const settings = new Settings<IConfig>('settings.json');
// Init global variables
    globalVars.settings = settings.get();
    globalVars.configurator = new Configurator(globalVars.settings);
    globalVars.auth = new Auth(globalVars.settings);
    globalVars.expressServer = new ExpressServer(globalVars.settings);
    globalVars.database = new Database(globalVars.settings);
    globalVars.sequelize = globalVars.database.getConnection();
    globalVars.permissions = new Permissions(globalVars.sequelize);
    await globalVars.database.injectModels();
    await globalVars.permissions.init();

    new Auth(globalVars.settings);

    await globalVars.expressServer.init();
    await globalVars.permissions.init();
    await applyAcl();
    globalVars.expressServer.start();
  } catch (err) {
    console.error(err);
  }
})();
