import {Model, Sequelize} from 'sequelize-typescript';
import * as path from 'path';
import * as fs from "fs-extra";
import {IDatabase} from "./interfaces/IDatabase";
import Settings from './Settings';
import {IDatabaseConfig, IConfig} from './interfaces/ISettings';
import globalVars, {default as Injector} from "./Injector";

/**
 * Database - class to work with sequelize
 * All available connections will store to "connections" except default connection
 * You can create connection by "createConnection" function(when name not transferred the connection is default)
 * You can get any connection by "getConnection" or call this function without name and get default connection
 */
export default class Database implements IDatabase {
  private connections: any = {};
  private sequelize: Sequelize;
  private databaseParams: IDatabaseConfig;

  constructor(private settings: IConfig) {
    let dbSettings = new Settings<IDatabaseConfig>('database.json');
    this.databaseParams = dbSettings.get();
    this.createConnection();
  }

  /**
   * Function to create new database connection
   * Create named connection and save to connections array,
   * if name is not specified - create default connection
   * @param name
   * @param connectOptions
   * @returns {Sequelize}
   */
  public createConnection(name?, connectOptions?): Sequelize {
    if (!name) {
      this.sequelize = new Sequelize({
        name: this.databaseParams.database,
        dialect: this.databaseParams.dialect,
        host: process.env.DB_HOST,
        username: this.databaseParams.username,
        password: this.databaseParams.password,
        logging: Injector.logger.verbose.bind(Injector.logger)
      });
      return this.sequelize;
    }

    this.connections[name] = new Sequelize({
      name: connectOptions.database,
      dialect: connectOptions.dialect,
      host: connectOptions || process.env.DB_HOST,
      username: connectOptions.username,
      password: connectOptions.password,
      logging: Injector.logger.verbose.bind(Injector.logger)
    });
    return this.connections[name];
  }

  /**
   * Function to find all models in transferred path and include to Sequlize instance
   * Can recursive search
   * Files should be in format: "example.model.ts"
   * @param {string} modelsPath
   * @returns {Promise<void>}
   */
  public async injectModels(modelsPath?: string) {
    modelsPath = modelsPath || path.join(__dirname, '../', this.settings.server.modulesPath);
    let files = await fs.readdir(modelsPath);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      let fileStat = await fs.stat(path.join(modelsPath, file));
      if (fileStat.isDirectory()) {
        await this.injectModels(path.join(modelsPath, file));
      }
      if (path.extname(file) !== '.js' || !~file.indexOf('model')) {
        continue;
      }
      this.addModel(path.join(modelsPath, file));
    }
  }

  /**
   * Function to get connection by name,
   * if name not specified - return default connection
   * @param name
   * @returns {Sequelize}
   */
  public getConnection(name?): Sequelize {
    if (!name) {
      return this.sequelize;
    }
    if (!this.connections[name]) {
      throw new Error(`Connection "${name}" not found`);
    }
    return this.connections[name];
  }

  /**
   * Function to custom adding model to Sequelize
   * @param {string | Model} model - can be a Model class or path to one model
   */
  public addModel(model: string | typeof Model) {
    if (typeof model === 'string') {
      const importedModel = require(model);
      const modelName = (Object.keys(importedModel))[0];
      this.sequelize.addModels([importedModel[modelName]]);
      globalVars.logger.info(`Model registered: ${modelName}`);
    } else {
      this.sequelize.addModels([model]);
    }
  }
}
