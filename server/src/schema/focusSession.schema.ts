import { object, string, number, boolean, array, date, TypeOf, z } from "zod";

const commonSessionSchema = object({
    duration: number().min(300).max(10800),

    name: string().optional(),
    notes: string().optional(),
    linkedEntities: object({
        tasks: array(string()),
        projects: array(string()),
    }).optional(),
});

export const createActiveSessionSchema = object({
    body: commonSessionSchema.extend({
        startTime: string().datetime().optional(),
        active: boolean().default(true),
        mode: z.enum(["focus", "break", "longBreak"]).optional(),
    }),
});

export type createActiveSessionInput = TypeOf<typeof createActiveSessionSchema>;
