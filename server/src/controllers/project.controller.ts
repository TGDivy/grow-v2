import { Request, Response } from "express";
import mongoose from "mongoose";
import { createProjectInput, updateProjectInput } from "../schema/project.schema";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../services/project.service";
import { getEmoji } from "../utils/emoji";

export const createProjectHandler = async (req: Request<{}, {}, createProjectInput["body"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;
        const emoji = await getEmoji(body.emoji || body.title);

        const project = await createProject({ ...body, userId, emoji });

        return res.send(project);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        return res.status(500).send("Something went wrong");
    }
};

export const updateProjectHandler = async (
    req: Request<updateProjectInput["params"], {}, createProjectInput["body"]>,
    res: Response,
) => {
    const body = req.body;
    const userId = res.locals.user?.uid;

    // check if the user is the owner of the project
    const project = await getProject(req.params.id);

    if (!project || project.userId !== userId) {
        return res.status(401).send("Unauthorized");
    }

    const emoji = await getEmoji(body.emoji || body.title);

    const updatedProject = await updateProject(req.params.id, { ...body, emoji });

    if (!updatedProject) {
        return res.sendStatus(404);
    }

    return res.send(updatedProject);
};

export const getProjectHandler = async (req: Request<updateProjectInput["params"], {}, {}>, res: Response) => {
    const project = await getProject(req.params.id);

    if (!project) {
        return res.sendStatus(404);
    }

    return res.send(project);
};

export const getAllProjectsHandler = async (req: Request<{}, {}, {}>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const projects = await getProjects(userId);

    return res.send(projects);
};

export const deleteProjectHandler = async (req: Request<updateProjectInput["params"], {}, {}>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const project = await getProject(req.params.id);

    if (!project || project.userId !== userId) {
        return res.status(401).send("Unauthorized");
    }

    await deleteProject(req.params.id);

    return res.sendStatus(204);
};
