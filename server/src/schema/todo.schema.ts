import { object, string, number, boolean, array, TypeOf, date } from "zod";

const payload = {
    body: object({
        rawText: string({ required_error: "Raw Text is required" }),
        jsonString: string().optional(),
        htmlString: string().optional(),
        priority: number().min(0).max(25).optional().default(0),
        projects: array(string()).optional().default([]),
        contexts: array(string()).optional().default([]),
        dueDate: date().optional(),
        completed: boolean().optional().default(false),
        notes: array(string()).optional().default([]),
        tags: array(string()).optional().default([]),
        timeSpent: number().optional().default(0),
        timeEstimate: number().optional(),
        links: array(string()).optional().default([]),
    }),
};

const params = {
    params: object({
        id: string({ required_error: "Id is required" }),
    }),
};

export const createTodoSchema = object(payload);
export const getTodoSchema = object(params);
export const updateTodoSchema = object({ ...params, ...payload });
export const deleteTodoSchema = object(params);
// filters are passed as body
export const getAllTodosSchema = object({
    body: object({
        filters: object({
            priority: number().optional(),
            projects: array(string()).optional(),
            contexts: array(string()).optional(),
            dueDate: date().optional(),
            completed: boolean().optional(),
            notes: array(string()).optional(),
            tags: array(string()).optional(),
            timeSpent: number().optional(),
            timeEstimate: number().optional(),
            links: array(string()).optional(),
        }).optional(),
    }),
});

export type createTodoInput = TypeOf<typeof createTodoSchema>;
export type getTodoInput = TypeOf<typeof getTodoSchema>;
export type getAllTodosInput = TypeOf<typeof getAllTodosSchema>;
export type updateTodoInput = TypeOf<typeof updateTodoSchema>;
export type deleteTodoInput = TypeOf<typeof deleteTodoSchema>;
