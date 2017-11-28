import * as passport from 'passport';
import * as passportJwt from 'passport-jwt';
import * as path from "path";
import * as jwt from 'jwt-simple';
import {IConfig} from "./interfaces/ISettings";
import User from "../modules/user/user.model";

export class Auth {
  private options = {
    jwtFromRequest: this.jwtExtractor,
    secretOrKey: this.settings.jwt.secret
  };
  private verify: Function;
  private passport = null;

  constructor(private settings: IConfig) {
    this.getAuthModule();
    this.passport = passport.use(new passportJwt.Strategy(this.options, this.verify));
    this.passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  }

  public initialize() {
    return this.passport.initialize();
  }

  public generateToken(payload) {
    return jwt.encode(payload, this.settings.jwt.secret);
  }

  public isAuthenticated() {
    return this.passport.authenticate('jwt', {session: false});
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

  private jwtExtractor(req) {
    return req.headers.jwt;
  }
}
