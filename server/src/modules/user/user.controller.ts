import {User} from "./user.model";

export class UserController {
  static async list(req, res) {
    const users = await User.findAll();
    res.json({users});
  }
  static create() {

  }
  static update() {

  }
  static getById() {

  }
}
