import mongoose from "mongoose";
const { model, Schema } = mongoose; //express doesn`t support module, needed use so

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});
export default model("Token", TokenSchema);
