import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose, { ObjectId } from "mongoose";

export interface PastSessionInput {
    userId: UserRecord["uid"];

    duration: number;
    startTime: Date;

    name?: string;
    notes?: string;

    linkedEntities?: {
        tasks: ObjectId[];
        projects: ObjectId[];
    };
}

export interface PastSessionDocument extends PastSessionInput, Document {
    endTime: Date;
    completedAt: Date;
}

const activeSessionSchema = new mongoose.Schema<PastSessionDocument>({
    userId: { type: String, required: true },
    startTime: { type: Date, required: true },
    duration: { type: Number, min: 300, max: 10800, required: true }, // 3 hours max, 5 minutes min
    completedAt: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, computed: "startTime + duration * 1000" },

    name: { type: String, required: true },
    notes: { type: String, trim: true },
    linkedEntities: {
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    },
});

export default mongoose.model<PastSessionDocument>("PastSession", activeSessionSchema);
