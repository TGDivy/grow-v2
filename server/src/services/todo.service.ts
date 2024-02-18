import TodoModel, { TodoDocument, TodoInput } from "../models/todo.model";

export const createTodo = async (input: TodoInput) => {
    return TodoModel.create(input);
};

export const getTodo = async (id: string) => {
    return TodoModel.findById(id);
};

export const getTodos = async (userId: string, filters?: Partial<TodoInput>) => {
    return TodoModel.find({ userId, ...filters });
};

export const updateTodo = async (id: string, input: Partial<TodoInput>) => {
    const todo = await TodoModel.findById(id);
    if (!todo) {
        throw new Error("Todo not found");
    }

    Object.assign(todo, input);
    return todo.save();
};

export const deleteTodo = async (id: string) => {
    return TodoModel.findByIdAndDelete(id);
};
