import { Request, Response } from "express";
import { createGoalInput, updateGoalInput } from "../schema/goal.schema";
import { createGoal, deleteGoal, getGoal, updateGoal } from "../services/goal.service";
import mongoose from "mongoose";

export const createGoalHandler = async (req: Request<{}, {}, createGoalInput["body"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const body = req.body;

    const projectId = new mongoose.Types.ObjectId(body.projectId);

    const goal = await createGoal({ ...body, userId, projectId });

    return res.send(goal);
};

export const updateGoalHandler = async (
    req: Request<updateGoalInput["params"], {}, createGoalInput["body"]>,
    res: Response,
) => {
    const body = req.body;

    const projectId = new mongoose.Types.ObjectId(body.projectId);

    const goal = await updateGoal(req.params.id, { ...body, projectId });

    if (!goal) {
        return res.sendStatus(404);
    }

    return res.send(goal);
};

export const getGoalHandler = async (req: Request<updateGoalInput["params"]>, res: Response) => {
    const goal = await getGoal(req.params.id);

    if (!goal) {
        return res.sendStatus(404);
    }

    return res.send(goal);
};

export const deleteGoalHandler = async (req: Request<updateGoalInput["params"]>, res: Response) => {
    const goal = await deleteGoal(req.params.id);

    if (!goal) {
        return res.sendStatus(404);
    }

    return res.sendStatus(204);
};
