import TodoModel, { TodoDocument, TodoInput } from "../models/todo.model";

export const createTodo = async (input: TodoInput) => {
    return TodoModel.create(input);
};

export const getTodo = async (id: string) => {
    return TodoModel.findById(id);
};

export const getTodos = async (userId: string, filters?: Partial<TodoInput>) => {
    if (filters?.projects && filters.projects.length > 0) {
        console.log("filters", filters);
        return TodoModel.find({ userId, projects: filters.projects });
    }
    return TodoModel.find({ userId });
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
