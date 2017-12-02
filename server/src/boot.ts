import * as path from "path";

declare function require(name: string);
require('source-map-support').install();

import Settings from "./core/Settings";
import {IConfig} from "./core/interfaces/ISettings";
import Configurator from "./core/Configurator";
import {Injector} from "./core/Injector";
import Database from "./core/Database";
import {ExpressServer} from "./core/ExpressServer";
import {Auth} from "./core/Auth";
import {Permissions} from "./core/permissions/Permissions";
import {applyAcl} from "./permissions";
import {Logger} from "./core/Logger";

(async function () {
  try {
    const settings = new Settings<IConfig>('settings.json');
// Init global variables
    Injector.settings = settings.get();
    Injector.logger = new Logger(Injector.settings);
    Injector.configurator = new Configurator(Injector.settings);
    Injector.auth = new Auth(Injector.settings);
    Injector.expressServer = new ExpressServer(Injector.settings);
    Injector.database = new Database(Injector.settings);
    Injector.sequelize = Injector.database.getConnection();
    Injector.permissions = new Permissions(Injector.sequelize);
    await Injector.database.injectModels();
    await Injector.permissions.init();

    new Auth(Injector.settings);

    await Injector.expressServer.init();
    await Injector.permissions.init();
    await applyAcl();
    Injector.expressServer.start();
  } catch (err) {
    console.error(err);
  }
})();
