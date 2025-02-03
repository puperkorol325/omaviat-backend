import { Profile } from "../types/Profile";
import { Video } from "../types/Video";
import { Comment } from "../types/Comment";

Array.prototype.INSERT_DATA = function (data): any {
    let i = 0;

    while (i < this.length && data.id > this[i].id) {
        i++;
    }

    this.splice(i, 0, data);
    return this;
};

export {};