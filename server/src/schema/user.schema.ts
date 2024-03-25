import { object, string, array, TypeOf } from "zod";

const deviceInfo = object({
    deviceToken: string(),
    deviceType: string(),
    // Add other device-specific properties here
});

const userSettings = object({
    // Define user settings properties here
});

const payload = {
    body: object({
        uid: string(),
        email: string(),
        deviceInfo: array(deviceInfo).default([]),
        settings: userSettings.optional(),
    }),
};

const updatePayload = {
    body: object({
        email: string().optional(),
        deviceInfo: array(deviceInfo).optional(),
        settings: userSettings.optional(),
    }),
};

const params = {
    params: object({
        uid: string(),
    }),
};

export const createUserSchema = object(payload);
export const getUserSchema = object(params);
export const updateUserSchema = object({ ...params, ...updatePayload });
export const deleteUserSchema = object(params);

export type createUserInput = TypeOf<typeof createUserSchema>;
export type getUserInput = TypeOf<typeof getUserSchema>;
export type updateUserInput = TypeOf<typeof updateUserSchema>;
export type deleteUserInput = TypeOf<typeof deleteUserSchema>;
