import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-exceptions.js";

export class UserControler {
  async registration(req, res, next) {
    const { email, password } = req.body;
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return next(
          ApiError.BadRequest("Error validate Controller", error.array()),
        );
      }
      const userData = await userService.createUser(email, password);
      res.cookie("refreshToken", userData.refresToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refresToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const linkActivate = req.params.link;
      await userService.activate(linkActivate);
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const qwe = await userService.refresh(refreshToken);
      res.json({express:"xha"})
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }
  async deleteUser(req, res, next) {
    const { id } = req.params;
    try {
      const deleted = await userService.delete(id);
      return res.json(deleted);
    } catch (e) {
      next(e);
    }
  }
}
export default new UserControler();
