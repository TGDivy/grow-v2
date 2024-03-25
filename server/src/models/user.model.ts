import mongoose from "mongoose";

export interface DeviceInfo {
    deviceToken: string;
    deviceType: string; // e.g., 'iOS', 'Android', 'Web'
    // Add other device-specific properties here
}

export interface UserSettings {
    // Add user settings properties here
}

export interface UserInput {
    uid: string; // User ID from Firebase
    email: string;
    deviceInfo?: DeviceInfo[];
    settings?: UserSettings;
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const DeviceInfoSchema = new mongoose.Schema(
    {
        deviceToken: { type: String, required: true },
        deviceType: { type: String, required: true },
        // Define other device-specific properties here
    },
    { _id: false },
); // _id is not needed for a sub-document

const UserSettingsSchema = new mongoose.Schema(
    {
        // Define user settings properties here
    },
    { _id: false },
); // _id is not needed for a sub-document

const UserSchema = new mongoose.Schema(
    {
        uid: { type: String, required: true },
        email: { type: String, required: true },
        deviceInfo: { type: [DeviceInfoSchema], required: false },
        settings: { type: UserSettingsSchema, required: false },
    },
    { timestamps: true },
);

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
