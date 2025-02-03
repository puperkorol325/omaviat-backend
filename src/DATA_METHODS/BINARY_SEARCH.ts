import { Profile } from "../types/Profile";
import { Video } from "../types/Video";
import { Comment } from "../types/Comment";

export function BINARY_SEARCH(data: (Profile | Comment | Video)[], id: string, criteria: string): number {

    let left = 0,
        right = data.length-1,
        middle = Math.floor((left + right) / 2);

    while (left <= right) {

        if (data[middle][criteria] < id) {
            left = middle+1;
        }else if (data[middle][criteria] > id) {
            right = middle-1;
        }else if (data[middle][criteria] === id) {
            return middle;
        }

        middle = Math.floor((left + right) / 2);
    }

    return -1;
}