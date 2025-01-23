import { Router } from "express";
import { ProfileService } from "./profile.service";
import { Profile } from "../types/profile";
import { v4 } from "uuid";

const router = Router();
const profileService = new ProfileService();

router.post('/', (request,response) => {

    const newProfile:Profile = {
        id: v4(),
        name: request.body.name,
        password: request.body.password,
        email: request.body.email
    };

    const profile = profileService.createProfile(newProfile);
    response.status(200).json(profile);
})

export const profileRouter = router;