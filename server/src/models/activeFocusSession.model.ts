import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose, { ObjectId } from "mongoose";

export interface ActiveSessionInput {
    userId: UserRecord["uid"];
    active: boolean;
    duration: number;

    startTime?: Date;
    name?: string;
    notes?: string;

    linkedEntities?: {
        tasks: ObjectId[];
        projects: ObjectId[];
    };
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
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    },
    active: { type: Boolean, required: true, default: true },
});

activeSessionSchema.pre<ActiveSessionDocument>("save", function (next) {
    if (!this.startTime) {
        this.startTime = new Date(Date.now());
    }
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60 * 1000);
    next();
});

export default mongoose.model<ActiveSessionDocument>("ActiveSession", activeSessionSchema);
