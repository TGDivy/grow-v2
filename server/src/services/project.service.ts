import ProjectModel, { ProjectInput } from "../models/project.model";

export const createProject = async (input: ProjectInput) => {
    return ProjectModel.create(input);
};

export const getProject = async (id: string) => {
    return ProjectModel.findById(id);
};

export const getProjects = async (userId: string, filters?: Partial<ProjectInput>) => {
    // find all projects that belong to the user
    return ProjectModel.find({ userId, ...filters });
};

export const updateProject = async (id: string, input: Partial<ProjectInput>) => {
    return ProjectModel.findByIdAndUpdate(id, input, { new: true });
};

export const deleteProject = async (id: string) => {
    return ProjectModel.findByIdAndDelete(id);
};
