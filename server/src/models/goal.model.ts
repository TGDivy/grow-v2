import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose, { ObjectId } from "mongoose";

export interface GoalInput {
    title: string;
    projectId: mongoose.Types.ObjectId;
    userId: UserRecord["uid"];

    description?: string;

    dueDate?: Date;
    completed?: boolean;
}

export interface GoalDocument extends GoalInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;

    _id: ObjectId;
}

const GoalSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

        dueDate: { type: Date, required: false },
        completed: { type: Boolean, required: true },

        projectId: { type: mongoose.Types.ObjectId, ref: "Project" },
        user: { type: String, required: true },

        _id: { type: mongoose.Types.ObjectId, required: true },
    },
    { timestamps: true },
);

const Goal = mongoose.model<GoalDocument>("Goal", GoalSchema);

export default Goal;
