import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose from "mongoose";

export interface JournalEntry {
    speaker: string;
    message: string;
    timestamp: Date;
}

export interface JournalSessionInput {
    userId: UserRecord["uid"];
    startTime: Date;
    endTime?: Date;
    location?: string;
    entry: string;
    exchanges?: JournalEntry[];
    moodBefore?: string | number;
    moodAfter?: string | number;
    prompts?: string[];
    tags?: string[];
    summary?: string;
}

export interface JournalSessionDocument extends JournalSessionInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const JournalSessionSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date },
        location: { type: String },
        entry: { type: String, required: true },
        exchanges: [{ speaker: String, message: String, timestamp: Date }],
        moodBefore: { type: mongoose.Schema.Types.Mixed },
        moodAfter: { type: mongoose.Schema.Types.Mixed },
        prompts: [{ type: String }],
        tags: [{ type: String }],
        summary: { type: String },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true },
);

JournalSessionSchema.pre<JournalSessionDocument>("save", function (next) {
    this.updatedAt = new Date();
    return next();
});

const JournalSession = mongoose.model<JournalSessionDocument>("JournalSession", JournalSessionSchema);

export default JournalSession;
