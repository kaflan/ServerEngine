import * as passport from 'passport';
import * as passportJwt from 'passport-jwt';
import * as path from "path";
import * as jwt from 'jwt-simple';
import {IConfig} from "./interfaces/ISettings";

export class Auth {
  private options = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
  };
  private verify: Function;

  constructor(private settings: IConfig) {
    this.getAuthModule();
    passport.use(new passportJwt.Strategy(this.options, this.verify));
  }

  public initialize() {
    return passport.initialize();
  }

  public generateToken(payload) {
    return jwt.encode(payload, this.settings.jwt.secret);
  }

  private getAuthModule() {
    const authModulePath = path.join(
      __dirname, '../',
      this.settings.server.modulesPath,
      this.settings.server.authModule,
      this.settings.server.authModule + '.controller.js'
    );
    const module = require(authModulePath).default;
    this.verify = module.verify;
  }
}
