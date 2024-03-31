import { object, string, number, array, TypeOf, date, boolean } from "zod";

const journalEntry = object({
    speaker: string(),
    rawText: string(),
    jsonString: string().optional(),
    htmlString: string().optional(),
    timestamp: string()
        .datetime()
        .transform((date) => new Date(date)),
});

const payload = {
    body: object({
        location: string().optional(),
        exchanges: array(journalEntry),
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
        location: string().optional(),
        exchanges: array(journalEntry).optional(),
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
export const getDelphiMessageSchema = object({
    params: object({}),
});

export const finishJournalSessionSchema = object(params);
export const getJournalSessionSchema = object(params);
export const getAllJournalSessionsSchema = object({});
export const updateJournalSessionSchema = object({ ...params, ...updatePayload });
export const deleteJournalSessionSchema = object(params);
export const getJournalPrompt = object({});

export type createJournalSessionInput = TypeOf<typeof createJournalSessionSchema>;
export type getDelphiMessageInput = TypeOf<typeof getDelphiMessageSchema>;
export type finishJournalSessionInput = TypeOf<typeof finishJournalSessionSchema>;
export type getJournalSessionInput = TypeOf<typeof getJournalSessionSchema>;
export type getAllJournalSessionsInput = TypeOf<typeof getAllJournalSessionsSchema>;
export type updateJournalSessionInput = TypeOf<typeof updateJournalSessionSchema>;
export type deleteJournalSessionInput = TypeOf<typeof deleteJournalSessionSchema>;
export type getJournalPromptInput = TypeOf<typeof getJournalPrompt>;
