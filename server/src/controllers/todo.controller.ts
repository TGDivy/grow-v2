import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    createTodoInput,
    updateTodoInput,
    getTodoInput,
    deleteTodoInput,
    getAllTodosInput,
    createTodoSchema,
} from "../schema/todo.schema";
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from "../services/todo.service";

// Basic CRUD operations for a todo

export const createTodoHandler = async (req: Request<{}, {}, createTodoInput["body"]>, res: Response) => {
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const body = req.body;

        const todo = await createTodo({ ...body, userId });

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
        const todos = await getTodos(userId, { ...filters });
        return res.send(todos);
    } catch (error) {
        return res.status(500).send("Something went wrong");
    }
};

export const updateTodoHandler = async (
    req: Request<updateTodoInput["params"], {}, updateTodoInput["body"]>,
    res: Response,
) => {
    console.log("updateTodoHandler");
    const userId = res.locals.user?.uid;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    const todoId = req.params.id;

    try {
        const body = req.body;
        // first get the todo to check if it exists, and to get the userId
        let todo = await getTodo(todoId);

        if (!todo) {
            return res.sendStatus(404);
        }

        if (todo.userId !== userId) {
            return res.status(403).send("Unauthorized");
        }

        todo = await updateTodo(todoId, { ...body });

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

// Custom CRUD operations for a todo

export const toggleTodoHandler = async (req: Request<updateTodoInput["params"]>, res: Response) => {
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

        todo.completed = !todo.completed;
        if (todo.completed) {
            todo.completedAt = new Date();
        } else {
            todo.completedAt = undefined;
        }
        await todo.save();

        return res.send(todo);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send("Invalid id");
        }
        return res.status(500).send("Something went wrong");
    }
};
