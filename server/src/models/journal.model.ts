import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose from "mongoose";

export interface JournalEntry {
    speaker: string;
    timestamp: Date;
    rawText: string;
    jsonString?: string;
    htmlString?: string;
}

export interface JournalSessionInput {
    userId: UserRecord["uid"];

    location?: string;
    exchanges: JournalEntry[];

    summary?: string;
    tags?: string[];
}

export interface JournalSessionDocument extends JournalSessionInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const JournalSessionSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        location: { type: String },

        exchanges: [
            {
                speaker: { type: String, required: true },
                timestamp: { type: Date, required: true },
                rawText: { type: String, required: true },
                jsonString: { type: String },
                htmlString: { type: String },
            },
        ],

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
