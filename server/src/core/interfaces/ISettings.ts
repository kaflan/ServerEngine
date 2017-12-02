export interface ISettings {
  get(mode?: 'developmnet' | 'test' | 'production'): IConfig;
}

export interface IConfig {
  server: IServerConfig;
  logger: ILoggerConfig;
  jwt: IJwtConfig;
  view: IViewConfig;
}

export interface ILoggerConfig {
  level: string;
  logsFile: string;
  errorsFile: string;
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
