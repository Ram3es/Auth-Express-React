import mongoose from "mongoose";
const { model, Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  activationLink: { type: String },
});
export default model("User", UserSchema);
