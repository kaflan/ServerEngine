export interface ISettings {
  get(mode?: 'developmnet' | 'test' | 'production'): IConfig;
}

export interface IAclConfig {

}

export interface IConfig {
  server?: IServerConfig;
  jwt?: IJwtConfig;
  view?: IViewConfig;
}

export interface IDatabaseConfig {
  database: string;
  dialect: string;
  host: string;
  password: string;
  port: number;
  username: string;
}

export interface IServerConfig {s
  port: number;
  modulesPath: string;
  authModule: string;
}

export interface IJwtConfig {
  secret: string;
}

export interface IViewConfig {
  path: string;
  engine: string;
}

export interface IDatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;

  seederStorage: string;
  migrationStorage: string;
}
