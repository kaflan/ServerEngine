import {Methods, Router} from "../../core/Router";
import {AuthController} from "./auth.controller";

const userRouter = new Router('users', '/api', [
  {method: Methods.POST, path: "/login", handler: AuthController.login},
  {method: Methods.POST, path: "/registration", handler: AuthController.registration},
  {method: Methods.GET, path: "/", handler: AuthController.logout},
]);
