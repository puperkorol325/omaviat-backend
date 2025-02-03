import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Video } from "../types/Video";

export const VIDEOS_DB_PATH:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../video/videosDB.json')

export async function READ_VIDEOS_DATA(): Promise<Video[]> {

        try {
            const data:[] = await JSON.parse(await fs.readFile(VIDEOS_DB_PATH, 'utf-8'));

            return data;

        }catch (err) {

            return [];
        }

}