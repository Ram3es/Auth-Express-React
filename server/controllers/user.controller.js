import userService from "../services/user.service.js";
import { validationResult } from "express-validator"
import { ApiError } from "../exceptions/api-exceptions.js";

export class UserControler {
  async registration(req, res, next) {
    
    const { email, password } = req.body;
    try {
     
      const error = validationResult(req)
      console.log(error, "result execute validation result");
      if(!error.isEmpty()){
        return next(ApiError.BadRequest("Error validate Controller", error.array()))
      }
      const userData = await userService.createUser(email, password);
      res.cookie("refreshToken", userData.refresToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
    } catch (e) {}
  }
  async logout(req, res, next) {
    try {
    } catch (e) {}
  }
  async activate(req, res, next) {
    try {
      const linkActivate = req.params.link
      await userService.activate(linkActivate)
       res.redirect(process.env.CLIENT_URL)
      
    } catch (e) {}
  }
  async refresh(req, res, next) {
    try {
    } catch (e) {}
  }
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (e) {}
  }
  async deleteUser(req, res, next) {
    const { id } = req.params;
    try {
      const deleted = await userService.delete(id);
      return res.json(deleted);
    } catch (e) {
      console.log(e);
    }
  }
}
export default new UserControler();
