import jwt from "jsonwebtoken";
import tokenModel from "../models/token.model.js";

class TokenService {
  async generateToken(payload) {
    const { sign } = jwt;
    const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
    const refresToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30d" });
    return {
      accessToken,
      refresToken,
    };
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
}

export default new TokenService();
