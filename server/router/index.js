import { Router } from "express";
import UserControler from "../controllers/user.controller.js";

const routes = Router();

routes.post("/registration", UserControler.registration);
routes.post("/login", UserControler.login);
routes.post("/logout", UserControler.logout);
routes.post("/activate/:link", UserControler.activate);
routes.get("/refresh", UserControler.refresh);
routes.get("/users", UserControler.getUsers);
routes.delete("/users/:id", UserControler.deleteUser);

export default routes;
