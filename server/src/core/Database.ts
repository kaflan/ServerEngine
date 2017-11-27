import {Model, Sequelize} from 'sequelize-typescript';
import Settings from './Settings';
import {IDatabaseConfig} from './interfaces/ISettings';
import * as path from 'path';
import * as fs from "fs-extra";
import logger from "./Logger";

/**
 * Database - class to work with sequelize
 * All available connections will store to "connections" except default connection
 * You can create connection by "createConnection" function(when name not transferred the connection is default)
 * You can get any connection by "getConnection" or call this function without name and get default connection
 */
export default class Database {
  private connections: any = {};
  private sequelize: Sequelize;
  private databaseParams: IDatabaseConfig;

  constructor(private settings) {
    let dbSettings = new Settings<IDatabaseConfig>('database.json');
    this.databaseParams = dbSettings.get();
    this.createConnection();
  }

  public createConnection(name?, connectOptions?) {
    if (!name) {
      this.sequelize = new Sequelize({
        name: this.databaseParams.database,
        dialect: this.databaseParams.dialect,
        host: process.env.DB_HOST,
        username: this.databaseParams.username,
        password: this.databaseParams.password
      });
      return this.sequelize;
    }

    this.connections[name] = new Sequelize({
      name: connectOptions.database,
      dialect: connectOptions.dialect,
      host: connectOptions || process.env.DB_HOST,
      username: connectOptions.username,
      password: connectOptions.password
    });
    return this.connections[name];
  }

  public async injectModels(modelsPath?) {
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

  public getConnection(name?): Sequelize {
    if (!name) {
      return this.sequelize;
    }
    if (!this.connections[name]) {
      throw new Error(`Connection "${name}" not found`);
    }
    return this.connections[name];
  }

  public addModel(model: string | typeof Model) {
    if (typeof model === 'string') {
      const importedModel = require(model);
      const modelName = (Object.keys(importedModel))[0];
      this.sequelize.addModels([importedModel[modelName]]);
      logger.info(`Model registered: ${modelName}`);
    } else {
      this.sequelize.addModels([model]);
    }

  }
}
