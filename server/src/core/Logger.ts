import * as winston from 'winston';
import * as path from "path";
import {IConfig} from "./interfaces/ISettings";
import {ILogger} from "./interfaces/ILogger";

export class Logger implements ILogger {
  private winston = null;

  constructor(private settings: IConfig) {
    this.winston = new winston.Logger({
      level: settings.logger.level,
      format: 'json',
      colors: {info: 'blue'},
      transports: [
        new winston.transports.File({
          name: 'errors',
          filename: path.join(__dirname, '../../', settings.logger.errorsFile),
          level: 'error'
        }),
        new winston.transports.File({
          name: 'logs',
          filename: path.join(__dirname, '../../', settings.logger.logsFile)
        }),
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.winston.add(winston.transports.Console, {
        level: settings.logger.level,
        colorize: true,
      });
    }
  }

  public verbose(msg: string) {
    this.winston.verbose(msg);
  }

  public info(msg: string) {
    this.winston.info(msg);
  }

  public warn(msg: string) {
    this.winston.warn(msg);
  }

  public error(error: any) {
    this.winston.error(error);
  }
}
