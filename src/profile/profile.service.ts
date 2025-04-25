import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { AuthData, Profile, ProfileInfo } from "../types/Profile"
import Hashes from "jshashes";
import keygenerator from "keygenerator";
import { READ_API_KEYS } from "../DATA_METHODS/READ_API_KEYS";
import { READ_PROFILES_DATA } from '../DATA_METHODS/READ_PROFILES_DATA';
import { BINARY_SEARCH } from '../DATA_METHODS/BINARY_SEARCH';
import '../DATA_METHODS/INSERT_DATA';

export class ProfileService {

    private databasePath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), 'profilesDB.json');
    private APIKeysPath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../APIKeys.json');
    private encoder = new Hashes.SHA256();

    private deleteAPIKey(APIKey: string): void {

        setTimeout(async () => {
            let APIKeys:string[] = await READ_API_KEYS();
            APIKeys = APIKeys.filter(item => item === APIKey ? null : item);

            await fs.writeFile(this.APIKeysPath, JSON.stringify(APIKeys));
        }, 259200000)
    }

    async createProfile(profile:Profile): Promise<{ success: boolean, APIKey?: string, profileID?: string, error?: string }> {

        try {

            if (!profile.email || !profile.id || !profile.name || !profile.password || !profile.type || !profile.ratedVideos) {
                throw new Error("Some fields are not defined!");
            }

            const APIKeys:string[] = await READ_API_KEYS();
            const APIKey:string = this.encoder.hex(Date.now() + keygenerator.number());

            const data:Profile[] = await READ_PROFILES_DATA();

            if (BINARY_SEARCH(data, profile.email, 'email') == -1) {

                data.INSERT_DATA(profile);

                APIKeys.push(APIKey);
                this.deleteAPIKey(APIKey);

                await fs.writeFile(this.APIKeysPath, JSON.stringify(APIKeys));
                await fs.writeFile(this.databasePath, JSON.stringify(data));

                return { success:true, APIKey: APIKey, profileID: profile.id };
            }else {
                return {success: false, error: "Email is already used!"}
            }

        }catch (err) {
            return { success: false, error: err.message || "An unknown error occured."}
        }
    }

    async authorization(authData:AuthData): Promise<{ success: boolean, APIKey?: string, profileID?: string, error?: string }> {

        try {

            const APIKeys:string[] = await READ_API_KEYS();

            if (authData.APIKey) {

                if (APIKeys.includes(authData.APIKey)) {
                    return { success:true }
                }else {
                    throw new Error("You need to authorize");
                }
            
            }else {

                const data:Profile[] = await READ_PROFILES_DATA();
                const profile: Profile | undefined = data.find(item => item.email === authData.email && item.password === authData.password);

                const APIKey:string = this.encoder.hex(Date.now() + keygenerator.number());

                if (profile) {
                    APIKeys.push(APIKey);
                    await fs.writeFile(this.APIKeysPath, JSON.stringify(APIKeys));
                    this.deleteAPIKey(APIKey);

                    return { success:true, APIKey: APIKey, profileID: profile.id };
                }else {
                    return { success:false, error: "Invalid email or password."};
                }
            }

        }catch (err) {
            return { success:false, error: err.message || "An unknown error occured."};
        }
    }

    async getProfiles(APIKey:string): Promise<{success: boolean, data?: ProfileInfo[], error?:string}> {

        try {
            const APIKeys:string[] = await READ_API_KEYS();

            if (APIKeys.includes(APIKey)){

                const data:ProfileInfo[] = (await READ_PROFILES_DATA()).map(({ id, name }) => ( { id, name } ));

                return { success:true, data: data };
            }else {
                throw new Error("Access denied");
            }

        }catch (err) {
            return {success:false, error:err.message || "An unknown error occured."};
        }
    }

    async getProfileInfo(userId:string): Promise<{success: boolean; data?: ProfileInfo, error?:string}> {

        try {

            const data:Profile[] = await READ_PROFILES_DATA();
            const profile: Profile | null = data[BINARY_SEARCH(data, userId, 'id')] || null;

            if (!profile) {
                throw new Error("User has not been found");
            }

            const profileInfo: ProfileInfo = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                ratedVideos: profile.ratedVideos
            }

            return {success: true, data: profileInfo};

        }catch (err) {
            return {success:false, error: err.message || "An unknown message occured"};
        }
    }
}