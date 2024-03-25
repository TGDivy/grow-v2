import { Request, Response } from "express";
import mongoose from "mongoose";
import { createUserInput, deleteUserInput, getUserInput, updateUserInput } from "../schema/user.schema";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../services/user.service";

export const createUserHandler = async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    try {
        const body = req.body;

        const user = await createUser(body);

        return res.send(user);
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

export const getUserHandler = async (req: Request<getUserInput["params"], {}, {}>, res: Response) => {
    const userId = req.params.uid;

    try {
        const user = await getUser(userId);

        if (!user) {
            return res.sendStatus(404);
        }

        return res.send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};

export const updateUserHandler = async (
    req: Request<updateUserInput["params"], {}, updateUserInput["body"]>,
    res: Response,
) => {
    const userId = req.params.uid;

    try {
        const body = req.body;
        let user = await getUser(userId);

        if (!user) {
            return res.sendStatus(404);
        }

        user = await updateUser(userId, body);

        if (!user) {
            return res.sendStatus(404);
        }

        return res.send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};

export const deleteUserHandler = async (req: Request<deleteUserInput["params"]>, res: Response) => {
    const userId = req.params.uid;

    try {
        const user = await getUser(userId);

        if (!user) {
            return res.sendStatus(404);
        }

        await deleteUser(userId);

        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};
