import { Emoji } from "@emoji-mart/data";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose, { ObjectId } from "mongoose";

export interface ProjectInput {
    title: string;
    userId: UserRecord["uid"];

    description?: string;
    emoji?: Emoji;

    dueDate?: Date;
    completed?: boolean;
}

export interface ProjectDocument extends ProjectInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;

    _id: string;
}

const ProjectSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },

        description: { type: String, required: false },
        emoji: { type: Object, required: false },

        dueDate: { type: Date, required: false },
        completed: { type: Boolean, required: false },
    },
    { timestamps: true },
);

const Project = mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
