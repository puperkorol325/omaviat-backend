import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { authData, Profile, ProfileInfo } from "../types/Profile"
import { error } from 'console';

export class ProfileService {

    private databasePath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), 'profilesDB.json');
    private APIKeysPath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../APIKeys.json');

    async createProfile(profile:Profile, APIKey:string): Promise<{ success: boolean; error?: string }> {

        try {
            const APIKeys:string[] = JSON.parse(await fs.readFile(this.APIKeysPath, 'utf-8'))

            if (!APIKeys.includes(APIKey)) {
                throw new Error("Access denied");
            }

            if (!profile.email || !profile.id || !profile.name || !profile.password || !profile.type) {
                throw new Error("Some fields are not defined!");
            }

            const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
            const data:Profile[] = JSON.parse(fileContents);

            if (data.findIndex(item => item.email === profile.email) === -1) {
                data.push(profile);
                await fs.writeFile(this.databasePath, JSON.stringify(data));
                return { success:true };
            }else {
                return {success: false, error: "Email is already used!"}
            }

        }catch (err) {
            return { success: false, error: err.message || "An unknown error occured."}
        }
    }

    async authorization(authData:authData, APIKey:string): Promise<{ success: boolean; error?: string }> {

        try {
            const APIKeys:string[] = JSON.parse(await fs.readFile(this.APIKeysPath, 'utf-8'))

            if (!APIKeys.includes(APIKey)) {
                throw new Error("Access denied");
            }

            if (!authData.email || !authData.password) {
                throw new Error("Some fields are not defined!");
            }

            const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
            const data:Profile[] = await JSON.parse(fileContents);

            if (data.findIndex(item => item.email === authData.email && item.password === authData.password) != -1) {
                return {success:true};
            }else {
                return { success:false, error: "Invalid email or password."};
            }

        }catch (err) {
            return { success:false, error: err.message || "An unknown error occured."};
        }
    }

    async getProfiles(APIKey:string): Promise<{success: boolean; data?: Profile[], error?:string}> {

        try {
            const APIKeys:string[] = JSON.parse(await fs.readFile(this.APIKeysPath, 'utf-8'));

            if (APIKeys.includes(APIKey)){
                const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
                const data:Profile[] = await JSON.parse(fileContents);

                return {success:true, data: data};
            }else {
                throw new Error("Access denied");
            }

        }catch (err) {
            return {success:false, error:err.message || "An unknown error occured."};
        }
    }

    async getProfileInfo(userId:string,APIKey:string): Promise<{success: boolean; data?: ProfileInfo, error?:string}> {

        try {
            const APIKeys:string[] = JSON.parse(await fs.readFile(this.APIKeysPath, 'utf-8'));

            if (APIKeys.includes(APIKey)) {
                const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
                const data:Profile[] = await JSON.parse(fileContents);

                const profile:Profile | undefined = data.find(item => item.id === userId);

                if (!profile) {
                    throw new Error("User has not been found");
                }

                const profileInfo:ProfileInfo = {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email
                }

                return {success: true, data: profileInfo};
            }else {
                throw new Error("Access denied");
            }

        }catch (err) {
            return {success:false, error: err.message || "An unknown message occured"};
        }
    }
}