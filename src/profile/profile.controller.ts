import { response, Router } from "express";
import { ProfileService } from "./profile.service";
import { Profile } from "../types/Profile";
import { v4 } from "uuid";
import Hashes from "jshashes";

const router = Router();
const profileService = new ProfileService();

router.post('/reg', async (request,response) => {

    try {
        const encoder = new Hashes.SHA256;

        const newProfile:Profile = {
            id: v4(),
            name: request.body.name,
            password: encoder.hex(request.body.password),
            email: request.body.email,
            type: 'user'
        };

        profileService.createProfile(newProfile);
        response.status(200).send("You have been succesfully registred!");
    }catch(err) {
        response.status(500).send("Oh no! Something went wrong :(");
    }
});

router.post('/auth', async (request, response) => {
    try {
        const encoder = new Hashes.SHA256;
        const isProfileRegistred:boolean | null = await profileService.authorization({email: request.body.email, password: encoder.hex(request.body.password)});

        if (isProfileRegistred) {
            response.status(200).send("You have been succesfully authorized!")
        }else if (isProfileRegistred == false) {
            response.status(400).send("Try to check the input data");
        }else {
            throw new Error();
        }
    }catch (err) {
        response.status(500).send("Oh no! Something went wrong!");
    }
});

export const profileRouter = router;