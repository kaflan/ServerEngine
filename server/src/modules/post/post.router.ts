import {Methods, Router} from "../../core/Router";
import {PostController} from "./post.controller";

new Router('posts', '/api/posts', [
  {method: Methods.GET, path: "/", handler: PostController.list},
  {method: Methods.POST, path: "/", handler: PostController.create},
  {method: Methods.PUT, path: "/:id", handler: PostController.update},
]);
