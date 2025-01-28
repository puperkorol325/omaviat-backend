import { Router } from "express";
import { VideoService } from "./video.service";
import { Video } from "../types/Video";
import { v4 } from 'uuid';

const router = Router();
const videoService = new VideoService();

router.post('/upload', async (request,response) => {

    const APIKey = request.body.APIKey;

    const newVideo:Video = {
        id: v4(),
        uploaderId: request.body.uploaderId,
        url: request.body.url,
        title: request.body.title,
        description: request.body.description,
        likes: 0,
        dislikes: 0,
        comments: []
    };

    if (videoService.isRutubeVideo(newVideo.url)) {
        const result = await videoService.uploadVideo(newVideo, APIKey);

        if (result.success) {
            response.status(200).send("Your video has been successfully uploaded");
        }else {
            response.status(400).send(result.error);
        }
    }else {
        response.status(400).send("This video is not from Rutube");
    }
});

export const videoRouter = router;