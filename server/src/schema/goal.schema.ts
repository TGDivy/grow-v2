import { TypedEventEmitter } from "mongodb";
import { object, string, number, boolean, array, TypeOf, date } from "zod";

const payload = {
    body: object({
        title: string({ required_error: "Title is required" }),
        projectId: string({ required_error: "Project id is required" }),
        userId: string({ required_error: "User id is required" }),
        // Rest are optional
        description: string({ required_error: "Description is required" }).optional(),
        dueDate: date({ required_error: "Due date is required" }).optional(),
        completed: boolean({ required_error: "Completed is required" }).optional(),
    }),
};

const params = {
    params: object({
        id: string({ required_error: "Id is required" }),
    }),
};

export const createGoalSchema = object(payload);
export const getGoalSchema = object(params);
export const updateGoalSchema = object({ ...params, ...payload });
export const deleteGoalSchema = object(params);

export type createGoalInput = TypeOf<typeof createGoalSchema>;
export type getGoalInput = TypeOf<typeof getGoalSchema>;
export type updateGoalInput = TypeOf<typeof updateGoalSchema>;
export type deleteGoalInput = TypeOf<typeof deleteGoalSchema>;
