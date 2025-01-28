import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Video } from '../types/Video';

export class VideoService {

    private databasePath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), 'videosDB.json');
    private APIKeysPath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../APIKeys.json');
    private profilesDatabasePath:string = path.join(path.dirname(fileURLToPath(import.meta.url)), '../profile/profilesDB.json');

    isRutubeVideo(url: string): boolean {
        const rutubeRegex:RegExp = new RegExp("^(https?:\/\/)?(www\.)?(rutube\.ru|rutube\.com)\/video\/([a-zA-Z0-9\-]+)");
        return rutubeRegex.test(url);
    }
    
    async uploadVideo(videoData:Video, APIKey:string): Promise<{success: boolean, error?:string}> {

        try {

            const APIKeys:string[] = JSON.parse(await fs.readFile(this.APIKeysPath, 'utf-8'));
            
            if (APIKeys.includes(APIKey)) {

                const fileContents:string = await fs.readFile(this.databasePath, 'utf-8');
                const data:Video[] = await JSON.parse(fileContents);

                data.push(videoData);

                fs.writeFile(this.databasePath, JSON.stringify(data));

                return { success: true };
            }else {
                throw new Error("Access denied");
            }
        }catch (err) {
            return {success: false, error: err.message};
        }
    }
}