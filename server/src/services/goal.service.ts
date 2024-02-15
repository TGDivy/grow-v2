import GoalModel, { GoalDocument, GoalInput } from "../models/goal.model";

export const createGoal = async (input: GoalInput) => {
    return GoalModel.create(input);
};

export const getGoal = async (id: string) => {
    return GoalModel.findById(id);
};

export const getGoals = async () => {
    return GoalModel.find();
};

export const updateGoal = async (id: string, input: Partial<GoalInput>) => {
    return GoalModel.findByIdAndUpdate(id, input, { new: true });
};

export const deleteGoal = async (id: string) => {
    return GoalModel.findByIdAndDelete(id);
};
