import { UserRecord } from "firebase-admin/lib/auth/user-record";
import mongoose, { ObjectId } from "mongoose";

export interface TodoInput {
    raw: string;
    userId: UserRecord["uid"];

    priority?: number;
    projects: ObjectId[];
    contexts: string[];

    dueDate?: Date;
    completed?: boolean;

    notes?: string[];
    tags?: string[];

    timeSpent?: number;
    timeEstimate?: number;

    links?: string[];
}

export interface TodoDocument extends TodoInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;

    completedAt?: Date;
    _id: string;
}

const TodoSchema = new mongoose.Schema(
    {
        raw: { type: String, required: true },
        userId: { type: String, required: true },

        priority: { type: Number, required: true, default: 0, min: 0, max: 25 },
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
        contexts: [{ type: String, required: true }],

        dueDate: { type: Date },
        completed: { type: Boolean, required: true, default: false },

        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
        completedAt: { type: Date },

        notes: [{ type: String }],
        tags: [{ type: String }],

        timeSpent: { type: Number },
        timeEstimate: { type: Number },

        links: [{ type: String }],
    },
    { timestamps: true },
);

TodoSchema.pre<TodoDocument>("save", function (next) {
    this.updatedAt = new Date();
    // if no priority is set, set it to 0
    if (!this.priority) {
        this.priority = 0;
    }

    return next();
});

const Todo = mongoose.model<TodoDocument>("Todo", TodoSchema);

export default Todo;