import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

export interface PastSessionInput {
    userId: UserRecord["uid"];

    duration: number;
    startTime: Date;

    name?: string;
    notes?: string;

    linkedEntities?: {
        tasks: mongoose.Types.ObjectId[];
        projects: mongoose.Types.ObjectId[];
    };
}

export interface PastSessionDocument extends PastSessionInput, Document {
    endTime: Date;
    completedAt: Date;
}

const pastSessionSchema = new mongoose.Schema<PastSessionDocument>({
    userId: { type: String, required: true },
    startTime: { type: Date, required: true },
    duration: { type: Number, min: 300, max: 10800, required: true }, // 3 hours max, 5 minutes min
    completedAt: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, computed: "startTime + duration * 1000" },

    name: { type: String },
    notes: { type: String, trim: true },
    linkedEntities: {
        tasks: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
        projects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
    },
});

pastSessionSchema.pre<PastSessionDocument>("save", function (next) {
    this.endTime = new Date(this.startTime.getTime() + this.duration * 1000);
    this.completedAt = new Date(Math.max(this.endTime.getTime(), Date.now()));

    return next();
});

export default mongoose.model<PastSessionDocument>("PastSession", pastSessionSchema);
