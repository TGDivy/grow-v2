import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    createTodoInput,
    updateTodoInput,
    getTodoInput,
    deleteTodoInput,
    getAllTodosInput,
} from "../schema/todo.schema";
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from "../services/todo.service";

export const createTodoHandler = async (req: Request<{}, {}, createTodoInput["body"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;
        let projects: mongoose.Schema.Types.ObjectId[] = [];

        if (body.projects) {
            projects = body.projects.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
        }

        const todo = await createTodo({ ...body, userId, projects });

        return res.send(todo);
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

export const getTodoHandler = async (req: Request<getTodoInput["params"], {}, {}>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const todoId = req.params.id;

    try {
        const todo = await getTodo(todoId);

        if (!todo) {
            return res.sendStatus(404);
        }

        if (todo.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        return res.send(todo);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};

export const getAllTodosHandler = async (req: Request<{}, {}, getAllTodosInput["body"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const filters = req.body.filters;

    try {
        let projects: mongoose.Schema.Types.ObjectId[] = [];

        if (filters?.projects) {
            projects = filters.projects.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
        }
        const todos = await getTodos(userId, { ...filters, projects });

        return res.send(todos);
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
};

export const updateTodoHandler = async (
    req: Request<updateTodoInput["params"], {}, updateTodoInput["body"]>,
    res: Response,
) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const todoId = req.params.id;

    try {
        const body = req.body;
        let projects: mongoose.Schema.Types.ObjectId[] = [];

        if (body.projects) {
            projects = body.projects.map((id: string) => new mongoose.Schema.Types.ObjectId(id));
        }

        // first get the todo to check if it exists, and to get the userId
        let todo = await getTodo(todoId);

        if (!todo) {
            return res.sendStatus(404);
        }

        if (todo.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        todo = await updateTodo(todoId, { ...body, projects });

        if (!todo) {
            return res.sendStatus(404);
        }

        return res.send(todo);
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

export const deleteTodoHandler = async (req: Request<deleteTodoInput["params"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const todoId = req.params.id;

    try {
        const todo = await getTodo(todoId);

        if (!todo) {
            return res.sendStatus(404);
        }

        if (todo.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        await deleteTodo(todoId);

        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};