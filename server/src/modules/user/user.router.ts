import {Methods, Router} from "../../core/Router";
import {UserController} from "./user.controller";

const userRouter = new Router('/api/users', [
  {method: Methods.GET, path: "/", handler: UserController.list, isProtected: true},
  {method: Methods.POST, path: "/", handler: UserController.create},
  {method: Methods.PUT, path: "/:id", handler: UserController.update},
]);
