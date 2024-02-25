import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

export interface ActiveSessionInput {
    userId: UserRecord["uid"];
    active: boolean;
    duration: number;

    startTime?: Date;
    name?: string;
    notes?: string;

    linkedEntities?: {
        tasks: mongoose.Types.ObjectId[];
        projects: mongoose.Types.ObjectId[];
    };

    mode?: "focus" | "break" | "longBreak";
}

export interface ActiveSessionDocument extends ActiveSessionInput, Document {
    endTime: Date;
}

const activeSessionSchema = new mongoose.Schema<ActiveSessionDocument>({
    userId: { type: String, required: true },
    name: { type: String },
    notes: { type: String, trim: true },
    startTime: { type: Date, required: true, default: Date.now },
    duration: { type: Number, min: 300, max: 10800, required: true }, // 3 hours max, 5 minutes min
    endTime: { type: Date, computed: "startTime + duration * 1000" },
    linkedEntities: {
        tasks: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
        projects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
    },
    active: { type: Boolean, required: true, default: true },
    mode: { type: String, enum: ["focus", "break", "longBreak"], required: true, default: "focus" },
});

activeSessionSchema.pre<ActiveSessionDocument>("save", function (next) {
    logger.info("ActiveSession pre save hook");
    if (!this.startTime) {
        this.startTime = new Date(Date.now());
    }
    this.endTime = new Date(this.startTime.getTime() + this.duration * 1000);
    next();
    // if not mode, set mode to focus
    if (!this.mode) {
        this.mode = "focus";
    }
});

export default mongoose.model<ActiveSessionDocument>("ActiveSession", activeSessionSchema);
