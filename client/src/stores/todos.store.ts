/* eslint-disable @typescript-eslint/no-unused-vars */
import { TodoDocument } from "@server/models/todo.model";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface todoStoreType {
  loading: boolean;
  todos: TodoDocument[];
  setTodos: (todos: TodoDocument[]) => void;
  setLoading: (loading: boolean) => void;
  addTodo: (todo: TodoDocument) => void;
  updateTodo: (todo: TodoDocument) => void;
}

const initialValues = {
  todos: [],
  loading: false,
};

const useTodoStore = create<todoStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, _get) => ({
        ...initialValues,
        setTodos: (todos: TodoDocument[]) => set({ todos, loading: false }),
        setLoading: (loading: boolean) => set({ loading }),
        addTodo: (todo: TodoDocument) =>
          set((state) => ({ todos: [...state.todos, todo] })),
        updateTodo: (todo: TodoDocument) =>
          set((state) => ({
            todos: state.todos.map((p) => (p._id === todo._id ? todo : p)),
          })),
      }),
      { name: "todoStore" }
    )
  )
);

export default useTodoStore;
