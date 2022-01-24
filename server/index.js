import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import routes from "./router/index.js";
import errorMiddleWare from "./middlewares/errors.handler.js"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 6000;

app.use(express.json());
app.use(cors());
app.use(cookieParser()); // use response cookie
app.use("/api", routes);
app.use(errorMiddleWare)

const start = async () => {
  try {
    await mongoose.connect(process.env.CLIENT_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server was run port: ${PORT} `);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
