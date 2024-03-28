import JournalSessionModel, { JournalSessionDocument, JournalSessionInput } from "../models/journal.model";

export const createJournalSession = async (input: JournalSessionInput) => {
    return JournalSessionModel.create(input);
};

export const getJournalSession = async (id: string) => {
    return JournalSessionModel.findById(id);
};

export const getJournalSessionBetweenDates = async (userId: string, startDate: Date, endDate: Date) => {
    return JournalSessionModel.find({ userId, createdAt: { $gte: startDate, $lte: endDate } });
};

export const getJournalSessions = async (userId: string) => {
    return JournalSessionModel.find({ userId });
};

export const updateJournalSession = async (id: string, input: Partial<JournalSessionInput>) => {
    const journalSession = await JournalSessionModel.findById(id);
    if (!journalSession) {
        throw new Error("Journal session not found");
    }

    Object.assign(journalSession, input);
    return journalSession.save();
};

export const deleteJournalSession = async (id: string) => {
    return JournalSessionModel.findByIdAndDelete(id);
};
