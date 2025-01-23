import { Profile } from "../types/profile";

export class ProfileService {
    createProfile(profile): () => Profile {
        return profile;
    }
}