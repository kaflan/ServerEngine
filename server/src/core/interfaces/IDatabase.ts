import {Model, Sequelize} from "sequelize-typescript";

export interface IDatabase {
  createConnection(name?, connectOptions?): Sequelize;
  injectModels(modelsPath?: string): Promise<void>;
  getConnection(name?: string): Sequelize;
  addModel(model: string | typeof Model);
}
