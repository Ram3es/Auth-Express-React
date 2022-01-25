import { Router } from "express";
import UserControler from "../controllers/user.controller.js";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth.middleware.js";

const routes = Router();

routes.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 16 }),
  UserControler.registration,
);
routes.post("/login", UserControler.login);
routes.post("/logout", UserControler.logout);
routes.get("/activate/:link", UserControler.activate);
routes.get("/refresh", UserControler.refresh);
routes.get("/users",authMiddleware, UserControler.getUsers);
routes.delete("/users/:id", UserControler.deleteUser);

export default routes;
