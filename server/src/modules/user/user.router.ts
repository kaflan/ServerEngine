import {Methods, Router} from "../../core/Router";
import {UserController} from "./user.controller";

new Router('users', '/api/users', [
  {method: Methods.GET, path: "/", handler: UserController.list, permissions: "list"},
  {method: Methods.POST, path: "/", handler: UserController.create},
  {method: Methods.PUT, path: "/:id", handler: UserController.update},
]);
