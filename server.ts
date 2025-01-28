import express from "express";
import { profileRouter } from "./src/profile/profile.controller";
import dotenv from "dotenv";
import cors from 'cors';
import helmet from "helmet";
import { videoRouter } from "./src/video/video.controller";

dotenv.config();

const app = express();

async function main() {

  app.use(helmet());

  app.use(cors({
    origin: "http://127.0.0.1:5500"
  }))

  app.use(express.json());

  app.use("/api/profile", profileRouter);

  app.use("/api/video", videoRouter);

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}

main();
