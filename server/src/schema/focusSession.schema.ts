import { object, string, number, boolean, array, date, TypeOf } from "zod";

const commonSessionSchema = object({
    duration: number().min(300).max(10800),

    name: string().optional(),
    notes: string().optional(),
    linkedEntities: object({
        tasks: array(string().uuid()),
        projects: array(string().uuid()),
    }).optional(),
});

export const createActiveSessionSchema = object({
    body: commonSessionSchema.extend({
        startTime: string().datetime().optional(),
        active: boolean().default(true),
    }),
});

export type createActiveSessionInput = TypeOf<typeof createActiveSessionSchema>;
