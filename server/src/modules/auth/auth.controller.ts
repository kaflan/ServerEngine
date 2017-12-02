import User from "../user/user.model";
import globalVars from "../../core/Injector";
import {ApiValidationError, SchemaValidationError} from "../../core/Errors";
import IRC from "../../IRC";
import {registrationDataValidator} from "./auth.validator";

export class AuthController {
  static async login(req, res, next) {
    try {
      if (!req.body.email || !req.body.password) {
        throw new ApiValidationError(IRC.REQUIRED_FIELDS_NOT_SUBMITTED);
      }
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.scope('auth').findOne<User>({where: {email: email}});

      if (!user) {
        throw new ApiValidationError(IRC.NON_EXISTENT_USER);
      }
      if (!await user.checkPassword(password)) {
        throw new ApiValidationError(IRC.INCORRECT_PASSWORD);
      }

      const payload = {
        id: user.id,
        email: user.email,
        password: user.password
      };
      const token = globalVars.auth.generateToken(payload);
      res.json({token});
    } catch (error) {
      next(error);
    }
  }

  static async registration(req, res, next) {
    try {
      if (!registrationDataValidator(req.body)) {
        throw new SchemaValidationError(registrationDataValidator.errors);
      }
      let user = new User({
        email: req.body.email,
        name: req.body.name,
        birthday: req.body.birthday
      });
      await user.setPassword(req.body.password);
      await user.save();
      res.json({user});
    } catch (error) {
      next(error);
    }
  }

  static async verify(jwt_payload, done) {
    try {
      const user = await User.scope('auth').findOne<User>({where: {id: jwt_payload.id, email: jwt_payload.email}});
      if (!user || user.password !== jwt_payload.password) {
        return done(null, false);
      }
      let userData = user.get({plain: true});
      userData.permissions = await globalVars.permissions.getUserPermissions(user.id);

      return done(null, userData);
    } catch (error) {
      return done(error, false);
    }
  }

  static logout() {

  }
}

export default AuthController;
