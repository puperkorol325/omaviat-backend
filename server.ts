import express from "express";
import { profileRouter } from "./src/profile/profile.controller";
import dotenv from "dotenv";
import cors from 'cors';
import helmet from "helmet";
import { videoRouter } from "./src/video/video.controller";
import rateLimit from "express-rate-limit";
import { Profile } from "./src/types/Profile";
import { Video } from "./src/types/Video";
import { Comment } from "./src/types/Comment";

dotenv.config();

const app = express();

declare global {

    interface Array<T> {
      INSERT_DATA: (data: any) => any[];
    }

}

async function main() {

  app.use(helmet());

  app.use(rateLimit({
    windowMs: 10*60*1000,
    max: 100
  }));

  const corsOptions = {
    origin: (origin, callback) => {
      const blockedOrigin = "80.78.242.151/:1"; 
      if (origin === blockedOrigin || !origin) {
        callback(new Error('CORS not allowed for this origin'), false);
      } else {
        callback(null, true);
      }
    },
    preflightContinue: true
  };

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use("/api/profile", profileRouter);

  app.use("/api/video", videoRouter);

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}

main();
