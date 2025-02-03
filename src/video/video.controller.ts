import { Request, Response, Router } from "express";
import { VideoService } from "./video.service";
import { Video } from "../types/Video";
import { v4 } from 'uuid';
import { Comment } from "../types/Comment";

const router = Router();
const videoService = new VideoService();

router.post('/upload', async (request: Request,response: Response) => {

    const APIKey = request.body.APIKey;

    const newVideo:Video = {
        id: v4(),
        uploaderId: request.body.userID,
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

router.get('/:videoID', async (request: Request,response: Response) => {

    const APIKey: string = request.body.APIKey;
    const videoID: string = request.params.videoID;

    const result = await videoService.getVideo(videoID, APIKey);

    if (result.success) {
        response.status(200).send(JSON.stringify(result.data));
    }else {
        response.status(400).send(result.error);
    }
});

router.post('/:videoID/comment', async (request: Request, response: Response) => {

    const APIKey: string = request.body.APIKey;
    const videoID: string = request.params.videoID;
    const comment: Comment = {
        id: v4(),
        uploaderId: request.body.userId,
        videoId: videoID,
        text: request.body.text
    };

    const result = await videoService.leaveComment(comment, videoID, APIKey);

    if (result.success) {
        response.status(200).send("You successfully commented video");
    }else {
        response.status(400).send(result.error);
    }
});

router.post('/:videoID/:rating', async (request: Request, response: Response) => {

    const APIKey: string = request.body.APIKey;
    const videoID: string = request.params.videoID;
    const userID: string = request.body.userID;
    const rating: string = request.params.rating;

    const result = await videoService.rateVideo(rating, videoID, userID, APIKey);

    if (result.success) {
        response.status(200).send(`Video ${rating}d!`);
    }else {
        response.status(400).send(result.error);
    }
});

export const videoRouter = router;