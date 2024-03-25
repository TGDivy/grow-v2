import UserModel, { UserDocument, UserInput } from "../models/user.model";

export const createUser = async (input: UserInput) => {
    return UserModel.create(input);
};

export const getUser = async (uid: string) => {
    return UserModel.findOne({ uid });
};

export const getUsers = async () => {
    return UserModel.find({});
};

export const updateUser = async (uid: string, input: Partial<UserInput>) => {
    const user = await UserModel.findOne({ uid });
    if (!user) {
        throw new Error("User not found");
    }

    Object.assign(user, input);
    return user.save();
};

export const deleteUser = async (uid: string) => {
    return UserModel.findOneAndDelete({ uid });
};
