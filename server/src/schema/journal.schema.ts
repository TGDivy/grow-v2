import { object, string, number, array, TypeOf, date } from "zod";

const journalEntry = object({
    speaker: string(),
    message: string(),
    timestamp: date(),
});

const payload = {
    body: object({
        userId: string(),
        startTime: date(),
        endTime: date().optional(),
        location: string().optional(),
        entry: string(),
        exchanges: array(journalEntry).optional(),
        moodBefore: number().min(1).max(10).optional(),
        moodAfter: number().min(1).max(10).optional(),
        prompts: array(string()).optional(),
        tags: array(string()).optional(),
        summary: string().optional(),
    }),
};

const updatePayload = {
    body: object({
        startTime: date().optional(),
        endTime: date().optional(),
        location: string().optional(),
        entry: string().optional(),
        exchanges: array(journalEntry).optional(),
        moodBefore: number().min(1).max(10).optional(),
        moodAfter: number().min(1).max(10).optional(),
        prompts: array(string()).optional(),
        tags: array(string()).optional(),
        summary: string().optional(),
    }),
};

const params = {
    params: object({
        id: string(),
    }),
};

export const createJournalSessionSchema = object(payload);
export const getJournalSessionSchema = object(params);
export const getAllJournalSessionsSchema = object({});
export const updateJournalSessionSchema = object({ ...params, ...updatePayload });
export const deleteJournalSessionSchema = object(params);

export type createJournalSessionInput = TypeOf<typeof createJournalSessionSchema>;
export type getJournalSessionInput = TypeOf<typeof getJournalSessionSchema>;
export type updateJournalSessionInput = TypeOf<typeof updateJournalSessionSchema>;
export type deleteJournalSessionInput = TypeOf<typeof deleteJournalSessionSchema>;
