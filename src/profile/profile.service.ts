import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Profile } from "../types/Profile"

export class ProfileService {

    private databasePath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), 'profilesDB.json');

    async createProfile(profile:Profile): Promise<void> {

        try {
            const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
            const data:Profile[] = JSON.parse(fileContents);

            data.push(profile);

            fs.writeFile(this.databasePath, JSON.stringify(data));
            
        }catch (err) {
            console.log(err);
        }


    }

    async authorization(profile:{email:string, password:string}): Promise<boolean | null> {

        try {
            const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
            const data:Profile[] = JSON.parse(fileContents);

            if (data.findIndex(item => item.email == profile.email && item.password == profile.password) != -1) {
                return true;
            }else {
                return false;
            }

        }catch (err) {
            console.log(err);
        }

        return null;
    }
}