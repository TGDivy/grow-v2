import ActiveSessionModel, { ActiveSessionInput } from "../models/activeFocusSession.model";
import PastSessionModel, { PastSessionInput } from "../models/pastFocusSession.model";
import { logger } from "../utils/logger";

// Active Focus Sessions

export const createFocusSession = async (input: ActiveSessionInput) => {
    return ActiveSessionModel.create(input);
};

export const getFocusSession = async (userId: string) => {
    return ActiveSessionModel.findOne({ userId });
};

export const updateFocusSession = async (userId: string, input: Partial<ActiveSessionInput>) => {
    const session = await ActiveSessionModel.findOne({ userId });
    if (!session) {
        throw new Error("No active session found");
    }

    return await ActiveSessionModel.findByIdAndUpdate(session._id, input, { new: true });
};

export const deleteFocusSession = async (userId: string) => {
    const session = await ActiveSessionModel.findOne({ userId });
    if (!session) {
        throw new Error("No active session found");
    }
    return await ActiveSessionModel.findByIdAndDelete(session._id);
};

// Past Focus Sessions

export const createPastFocusSession = async (input: PastSessionInput) => {
    return await PastSessionModel.create(input);
};

export const getAllPastFocusSessions = async (userId: string) => {
    return await PastSessionModel.find({ userId }).lean();
};

export const getAllPastFocusSessionsBetweenDates = async (userId: string, startDate: Date, endDate: Date) => {
    return await PastSessionModel.find({ userId, createdAt: { $gte: startDate, $lte: endDate } }).lean();
};
