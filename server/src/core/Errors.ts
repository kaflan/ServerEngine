import {ErrorObject} from "ajv";
import IRC from '../IRC';
import {
  IExtendableError,
  IApiValidationError,
  IError
} from './interfaces/IError';

const env: string = process.env.NODE_ENV || 'development';

class ExtendableError extends Error implements IExtendableError {
  public name: string;
  public message: string;

  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SchemaValidationError {
  public responseCode = 400;
  public code = 4000;
  public messages = [];

  constructor(errors: Array<ErrorObject>) {
    errors.forEach(item => this.messages.push(item));
  }

  response() {
    return {
      code: this.code,
      message: this.messages,
    };
  }
}

export class ApiValidationError extends ExtendableError implements IApiValidationError {
  public responseCode: number;
  public code: number;
  public extra: any;

  constructor(internalErrorConst: string | Object, extra?: any) {
    let internalError = null;
    if (typeof internalErrorConst === 'string') {
      internalError = IRC[internalErrorConst];
    } else {
      internalError = internalErrorConst;
    }

    super(internalError.message);
    this.responseCode = internalError.responseCode;
    this.message = internalError.message;
    this.code = internalError.code;
    this.extra = extra || null;
  }

  response() {
    return {
      code: this.code,
      message: this.message,
      extra: this.extra
    };
  }
}

export class ApiAclDenyError extends ExtendableError {
  private responseCode: number;

  constructor(resource, action) {
    let message = 'You don\'t have permissions';
    super(message);
    this.responseCode = 403;
    this.message = message;
  }

  response() {
    return {
      message: this.message
    };
  }
}



