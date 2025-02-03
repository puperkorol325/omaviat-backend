import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Profile } from '../types/Profile';

export const PROFILES_DB_PATH:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../profile/profilesDB.json');

export async function READ_PROFILES_DATA(): Promise<Profile[]> {

        try {
            const data:[] = await JSON.parse(await fs.readFile(PROFILES_DB_PATH, 'utf-8'));

            return data;

        }catch (err) {

            return [];
        }

}