import {IInjector} from "./interfaces/IInjector";

export let Injector: IInjector = {
  logger: null,
  permissions: null,
  auth: null,
  sequelize: null,
  database: null,
  expressServer: null,
  settings: null,
  configurator: null
};
export default Injector;


