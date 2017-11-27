import {Request, Response, NextFunction} from 'express';
import * as Sequelize from 'sequelize';
import IRC from '../IRC';
import {IError} from './interfaces/IError';
import logger from "./Logger";
import {ApiAclDenyError, ApiValidationError, SchemaValidationError} from "./Errors";

const env: string = process.env.NODE_ENV || 'development';

export class ErrorHandler {
  private static isDev: boolean = env === 'development';

  public static middleware() {
    return (err, req: Request, res: Response, next: NextFunction): Response | void => {
      if (res.headersSent) {
        return;
      }
      if (err instanceof ApiValidationError || err instanceof ApiAclDenyError || err instanceof SchemaValidationError) {
        return this.apiErrorHandler(err, res);
      }
      if (err instanceof Sequelize.ValidationError ||
        err instanceof Sequelize.UniqueConstraintError) {
        return this.handleSequelizeValidationError(err, res);
      }
      if (err instanceof Sequelize.DatabaseError) {
        return this.handleDatabaseError(err, res);
      }
      this.handleUnprocessedError(err, res);
    };
  }

  public static notFoundHandler() {
    return (req: Request, res: Response, next: NextFunction): Response => {
      let err: IError = new Error('Not Found');
      err.status = 404;

      return res
        .status(IRC['NOT_FOUND'].responseCode)
        .send({
          message: IRC['NOT_FOUND'].message
        });
    };
  }

  private static apiErrorHandler(err, res: Response): Response {
    return res
      .status(err.responseCode || 400)
      .send(err.response());
  }

  private static handleSequelizeValidationError(err, res: Response): Response {
    let validationErrors = err.errors.map(error => {
      return {
        field: error.path,
        message: error.message
      };
    });

    return res
      .status(422)
      .send(validationErrors);
  }

  private static handleDatabaseError(err, res: Response): Response {
    logger.error(err);
    if (!this.isDev) {
      return res
        .status(IRC['INTERNAL_SERVER_ERROR'].responseCode)
        .send({
          message: IRC['INTERNAL_SERVER_ERROR'].message
        });
    }
    return res
      .status(500)
      .send({
        message: err.message
      });
  }

  private static handleUnprocessedError(err, res: Response): Response {
    logger.error(err);
    if (err.trace) {
      console.trace(err.trace);
    }

    if (!this.isDev) {
      return res
        .status(IRC['INTERNAL_SERVER_ERROR'].responseCode)
        .send({
          message: IRC['INTERNAL_SERVER_ERROR'].message
        });
    }
    return res
      .status(500)
      .send({
        message: err.message
      });
  }
}
