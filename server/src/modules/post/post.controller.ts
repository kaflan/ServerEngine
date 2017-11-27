import {Post} from "./post.model";
import {ApiValidationError} from "../../core/Errors";
import IRC from "../../IRC";

export class PostController {
  static async list(req, res, next) {
    try {
      const posts = await Post.findAll();
      res.json({posts});
    } catch(error) {
      next(error);
    }
  }
  static create() {
    throw new ApiValidationError(IRC.BAD_REQUEST);
  }
  static update() {

  }
  static getById() {

  }
}
