import ActiveSessionModel, { ActiveSessionInput } from "../models/activeFocusSession.model";
import PastSessionModel, { PastSessionInput } from "../models/pastFocusSession.model";

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
    return ActiveSessionModel.findByIdAndUpdate(session._id, input, { new: true });
};

export const deleteFocusSession = async (userId: string) => {
    const session = await ActiveSessionModel.findOne({ userId });
    if (!session) {
        throw new Error("No active session found");
    }
    return ActiveSessionModel.findByIdAndDelete(session._id);
};

// Past Focus Sessions

export const createPastFocusSession = async (input: PastSessionInput) => {
    return PastSessionModel.create(input);
};

export const getAllPastFocusSessions = async (userId: string) => {
    return PastSessionModel.find({ userId }).lean();
};
