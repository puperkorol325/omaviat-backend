import { Request, Response, Router } from "express";
import { ProfileService } from "./profile.service";
import { Profile, AuthData } from "../types/Profile";
import { v4 } from "uuid";
import Hashes from "jshashes";


const router = Router();
const profileService = new ProfileService();

router.post('/reg', async (request: Request,response: Response) => {

    const encoder = new Hashes.SHA256;

    const newProfile:Profile = {
        id: v4(),
        name: request.body.name,
        password: encoder.hex(request.body.password),
        email: request.body.email,
        type: 'user',
        ratedVideos: []
    };

    const result = await profileService.createProfile(newProfile);

    if (result.success) {
        response.status(200).send(JSON.stringify(result));
    }else {
        response.status(500).send(result.error);
    }
});

router.post('/auth', async (request: Request, response: Response) => {

    const encoder = new Hashes.SHA256;

    const authData:AuthData = {
        email: request.body.email,
        password: encoder.hex(request.body.password),
        APIKey: request.body.APIKey
    }

    const result = await profileService.authorization(authData);

    if (result.success) {
        response.status(200).send("You have been succesfully authorized!")
    }else if (result.success == false) {
        response.status(400).send(result.error);
    }
});

router.post('/info/all', async (request: Request, response: Response) => {

    const APIKey = request.body.APIKey;

    const result = await profileService.getProfiles(APIKey);

    if (result.success) {
        response.status(200).send(JSON.stringify(result.data));
    }else {
        response.status(400).send(result.error);
    }
});

router.get('/info/:userId', async (request: Request,response: Response) => {

    const APIKey = request.body.APIKey;

    const result = await profileService.getProfileInfo(request.params.userId, APIKey);

    if (result.success) {
        response.status(200).send(JSON.stringify(result.data));
    }else {
        response.status(400).send(result.error);
    }
});

export const profileRouter = router;