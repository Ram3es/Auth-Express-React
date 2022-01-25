import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import userModel from "../models/user.model.js";
import tokenService from "./token.service.js";
import mailService from "./mail.service.js";
import { UserDto } from "../dtos/user.dto.js";
import { ApiError } from "../exceptions/api-exceptions.js";

export class UserService {
  async createUser(email, password) {
    const candidate = await userModel.findOne({ email }).exec();
    if (candidate) {
      throw ApiError.BadRequest("Already exist");
    }
    const hashPass = await bcrypt.hash(password, 5);
    const activationLink = uuid.v4();

    const user = await userModel.create({
      email,
      password: hashPass,
      activationLink,
    });
    await mailService.sendMailActivation(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateToken({ ...userDto }); // must be only !! literal {} for jwt.sign
    await tokenService.saveToken(userDto.id, tokens.refresToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest(" Incorrect link activation");
    }
    user.isActive = true;
    await user.save();
  }
  async login(email, password) {
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      throw ApiError.BadRequest(`User with such email not found`);
    }
    const isPassValid = await bcrypt.compare(password, userExist.password);
    if (!isPassValid) {
      throw ApiError.BadRequest("wrong password or email");
    }
    const userDto = new UserDto(userExist);
    const tokens = await tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresToken);
    return { ...tokens, user: userDto };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if(!userData || !tokenFromDb){
      throw ApiError.UnauthorizedError()  
    }
    const freshUserData = await userModel.findById(userData.id);
    const userDto = new UserDto(freshUserData);
    const tokens = await tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresToken);
    return { ...tokens, user: userDto };
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
