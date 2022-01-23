import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import userModel from "../models/user.model.js";
import tokenService from "./token.service.js";
import mailService from "./mail.service.js";
import { UserDto } from "../dtos/user.dto.js";

export class UserService {
  async createUser(email, password) {
    const candidate = await userModel.findOne({ email }).exec();
    if (candidate) {
      throw new Error("Already exist");
    }
    const hashPass = await bcrypt.hash(password, 5);
    const activationLink = uuid.v4();

    const user = await userModel.create({ email, password: hashPass, activationLink });
    await mailService.sendMailActivation(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateToken({ ...userDto }); // must be only !! literal {} for jwt.sign
    await tokenService.saveToken(userDto.id, tokens.refresToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink){
    const user = await userModel.findOne({activationLink})
    if(!user){
      throw new Error(" Incorrect link activation")
    }
    user.isActive = true;
    await user.save()
  }

  async getAllUsers() {
    return await userModel.find({});
  }

  async delete(id) {
    const removed = await userModel.deleteOne({ _id: id });
    return removed;
  }
}

export default new UserService();
