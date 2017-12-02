import * as express from 'express';
import * as path from "path";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as helmet from 'helmet';
import * as http from "http";
import {IConfig} from "./interfaces/ISettings";
import {Injector} from "./Injector";
import {Router} from "./Router";

export class ExpressServer {
  private _app;
  private config: IConfig;
  private serverInstance;

  constructor(private settings: IConfig) {
    this.app = express();
    this.config = settings;
  }

  get app(): express.Express {
    return this._app;
  }
  set app(value) {
    this._app = value;
  }

  /**
   * Function to init Express app
   * Sets body parsers, error handlers, init authentication ant etc.
   * @returns {Promise<void>}
   */
  public async init() {
    this.app.use(helmet());
    this.app.set('views', path.join(__dirname, this.config.view.path));
    this.app.set('view engine', this.config.view.engine);
    this.app.use(Injector.auth.initialize());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser());
    await Router.injectModuleRouters(path.join(__dirname, '../', this.config.server.modulesPath));
    this.app.use(Injector.configurator.errorsHandler);
    this.app.use(Injector.configurator.notFoundHandler);
  }

  public start() {
    this.serverInstance = http.createServer(this.app);
    this.serverInstance
      .listen(this.config.server.port)
      .on('error', this.onError.bind(this))
      .on('listening', this.onListening.bind(this));
  }

  private onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.config.server.port === 'string'
      ? 'Pipe ' + this.config.server.port
      : 'Port ' + this.config.server.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        Injector.logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        Injector.logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private onListening() {
    const addr = this.serverInstance.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    Injector.logger.info('Listening on ' + bind);
  }
}

