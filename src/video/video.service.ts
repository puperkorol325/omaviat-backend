import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Video } from '../types/Video';
import { Profile, ProfileInfo } from '../types/Profile';
import { Comment } from '../types/Comment';
import { READ_API_KEYS } from '../DATA_METHODS/READ_API_KEYS';
import { READ_PROFILES_DATA } from '../DATA_METHODS/READ_PROFILES_DATA';
import { READ_VIDEOS_DATA } from '../DATA_METHODS/READ_VIDEOS_DATA';
import { BINARY_SEARCH } from '../DATA_METHODS/BINARY_SEARCH';
import { randomInt } from 'crypto';


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

            const APIKeys:string[] = await READ_API_KEYS();
            
            if (APIKeys.includes(APIKey)) {

                const data:Video[] = await READ_VIDEOS_DATA();

                data.INSERT_DATA(videoData);

                fs.writeFile(this.databasePath, JSON.stringify(data));

                return { success: true };
            }else {
                throw new Error("Access denied");
            }
        }catch (err) {
            return {success: false, error: err.message};
        }
    }

    async getVideo(videoID:string): Promise<{success: boolean, data?: Video, error?:string}> {

        try {
            

            const videoData: Video[] = await READ_VIDEOS_DATA();
            const profileData: Profile[] = await READ_PROFILES_DATA();
            
            const video: Video | undefined = videoData[BINARY_SEARCH(videoData, videoID, 'id')];
            const uploader: ProfileInfo | undefined = profileData[BINARY_SEARCH(profileData, video?.uploaderId, 'id')];

            if (video && uploader) {
                const uploaderInfo: ProfileInfo = {
                    id: uploader?.id,
                    name: uploader?.name
                }
                return {success: true, data: video }
            }else {
                throw new Error("Video hasn't been found")
            }
        }catch (err) {
            return { success:false, error: err.message }
        }
    }

    async getVideos(count: number): Promise<{ success: boolean, data?: Video[], error?: string}> {

        try {

            const videoData: Video[] = await READ_VIDEOS_DATA();

            if (count <= count) {

                const videosToReturn: number[] = new Array(videoData.length > count ? count : videoData.length).fill(0).map(item => randomInt(videoData.length));
                const returnData: Video[] = [];

                for (let i of videosToReturn) {
                    returnData.push(videoData[i]);
                }

                console.log(videosToReturn);

                return { success: true, data: returnData };
            }else {
                throw new Error("You can't get more than 20 videos in a row");
            }
        }catch (err) {

            return {success: false, error: err.message};
        }
    }

    async rateVideo(rating: string, videoID: string, userID:string, APIKey: string): Promise<{success: boolean, error?:string}> { 

        try {
            const APIKeys: string[] = await READ_API_KEYS();

            if (APIKeys.includes(APIKey)) {

                const videoData: Video[] = await READ_VIDEOS_DATA();
                const profileData: Profile[] = await READ_PROFILES_DATA();

                const profileIndex: number | null = BINARY_SEARCH(profileData, userID, 'id');
                const videoIndex: number | null = BINARY_SEARCH(videoData, videoID, 'id');

                if (rating === "like" && profileIndex !== -1 && videoIndex !== -1) {

                    profileData[profileIndex] = {...profileData[profileIndex], ratedVideos: profileData[profileIndex].ratedVideos.INSERT_DATA({id: videoID, rating: rating})};
                    videoData.map(item => item.id === videoID ? {...item, likes: item.likes++} : item);
                }else if (rating === "dislike" && profileIndex !== -1 && videoIndex !== -1) {

                    profileData[profileIndex] = {...profileData[profileIndex], ratedVideos: [...profileData[profileIndex].ratedVideos, {id: videoID, rating: rating}]};
                    videoData.map(item => item.id === videoID ? {...item, likes: item.dislikes++} : item);
                }else {
                    throw new Error("Unknown rating");
                }

                await fs.writeFile(this.profilesDatabasePath, JSON.stringify(profileData));
                await fs.writeFile(this.databasePath, JSON.stringify(videoData));

                return { success: true }
            }else {
                throw new Error("You need to authorize to rate the video");
            }
        }catch (err) {
            return { success:false, error: err.message };
        }
    }

    async leaveComment(comment: Comment, videoID: string, APIKey: string): Promise<{success: boolean, error?:string}> {

        try {

            const APIKeys: string[] = await READ_API_KEYS();

            if (APIKeys.includes(APIKey)) {

                let data: Video[] = await READ_VIDEOS_DATA();

                data = data.map(item => item.id === videoID ? { ...item, comments: [...item.comments, comment] } : item) as Video[];

                await fs.writeFile(this.databasePath, JSON.stringify(data));

                return { success: true }
            }else {
                throw new Error("You need to authorize to rate the video");
            }

        }catch (err) {
            return { success: false, error: err.message };
        }
    }
}