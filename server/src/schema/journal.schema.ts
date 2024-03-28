import { object, string, number, array, TypeOf, date, boolean } from "zod";

const journalEntry = object({
    speaker: string(),
    rawText: string(),
    jsonString: string().optional(),
    htmlString: string().optional(),
    timestamp: date(),
});

const payload = {
    body: object({
        location: string().optional(),
        exchanges: array(journalEntry).optional(),
        tags: array(string()).optional(),
        summary: string().optional(),
        userCurrentDate: string()
            .datetime()
            .transform((date) => new Date(date)),
        forceRecreate: boolean().optional(),
    }),
};

const updatePayload = {
    body: object({
        startTime: string().datetime().optional(),
        endTime: string().datetime().optional(),
        location: string().optional(),
        rawText: string().optional(),
        jsonString: string().optional(),
        htmlString: string().optional(),
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
export const getJournalSessionForTodaySchema = object({});
export const getAllJournalSessionsSchema = object({});
export const updateJournalSessionSchema = object({ ...params, ...updatePayload });
export const deleteJournalSessionSchema = object(params);
export const getJournalPrompt = object({});

export type createJournalSessionInput = TypeOf<typeof createJournalSessionSchema>;
export type getJournalSessionInput = TypeOf<typeof getJournalSessionSchema>;
export type getJournalSessionForTodayInput = TypeOf<typeof getJournalSessionForTodaySchema>;
export type getAllJournalSessionsInput = TypeOf<typeof getAllJournalSessionsSchema>;
export type updateJournalSessionInput = TypeOf<typeof updateJournalSessionSchema>;
export type deleteJournalSessionInput = TypeOf<typeof deleteJournalSessionSchema>;
export type getJournalPromptInput = TypeOf<typeof getJournalPrompt>;
