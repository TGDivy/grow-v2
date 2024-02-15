import { Emoji } from "@emoji-mart/data";
import { ObjectId } from "mongodb";

class Project {
    constructor(
        public title: string,
        public completed: boolean,

        public description?: string,
        public emoji?: Emoji,
        public date_created?: Date,
        public date_updated?: Date,
        public _id?: ObjectId,
    ) {}
}

export default Project;
