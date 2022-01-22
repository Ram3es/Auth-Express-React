import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose'
import api from "./router/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000
const app = express();

app.use(express.json())
app.use(cors());
app.use(cookieParser());
app.use("/api", api)


const start = async () => {
  try {
    

    await mongoose.connect(process.env.CLIENT_DB,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    app.listen(PORT, () => {
      console.log(`Server was run port: ${PORT} `);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
