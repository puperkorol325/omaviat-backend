import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const API_KEYS_PATH:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../APIKeys.json');

export async function READ_API_KEYS(): Promise<string[]> {

        try {
            const data:[] = await JSON.parse(await fs.readFile(API_KEYS_PATH, 'utf-8'));

            return data;

        }catch (err) {

            return [];
        }

}