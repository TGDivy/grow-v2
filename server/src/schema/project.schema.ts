import { TypedEventEmitter } from "mongodb";
import { object, string, number, boolean, array, TypeOf, date } from "zod";

const payload = {
    body: object({
        title: string({ required_error: "Title is required" }),
        // Rest are optional
        description: string({ required_error: "Description is required" }).optional(),
        emoji: string({ required_error: "Emoji is required" }).optional(),

        dueDate: date({ required_error: "Due date is required" }).optional(),
        completed: boolean({ required_error: "Completed is required" }).optional(),
    }),
};

const params = {
    params: object({
        id: string({ required_error: "Id is required" }),
    }),
};

export const createProjectSchema = object(payload);
export const getProjectSchema = object(params);
export const getAllProjectsSchema = object({});
export const updateProjectSchema = object({ ...params, ...payload });
export const deleteProjectSchema = object(params);

export type createProjectInput = TypeOf<typeof createProjectSchema>;
export type getProjectInput = TypeOf<typeof getProjectSchema>;
export type getAllProjectsInput = TypeOf<typeof getAllProjectsSchema>;
export type updateProjectInput = TypeOf<typeof updateProjectSchema>;
export type deleteProjectInput = TypeOf<typeof deleteProjectSchema>;
