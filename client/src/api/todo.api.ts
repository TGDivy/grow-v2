import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { createTodoInput, updateTodoInput } from "@server/schema/todo.schema";
import { TodoDocument } from "@server/models/todo.model";
import { convertDateStringsToDates } from "src/utils/text";

export const todoAPI = axios.create({
  baseURL: `${API_DOMAIN}`,
  headers: {
    "Content-type": "application/json",
  },
});

todoAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }

  return config;
});

todoAPI.interceptors.response.use((response) => {
  response.data = convertDateStringsToDates(response.data);

  return response;
}, handleAxiosError);

export const getTodos = async () => {
  const response = await todoAPI.get<TodoDocument[]>("/todo");
  return response.data;
};

export const createTodo = async (todo: createTodoInput["body"]) => {
  const response = await todoAPI.post<TodoDocument>("/todo", todo);
  return response.data;
};

export const updateTodo = async (id: string, todo: updateTodoInput["body"]) => {
  const response = await todoAPI.put<TodoDocument>(`/todo/${id}`, todo);
  return response.data;
};

export const toggleTodo = async (id: string) => {
  const response = await todoAPI.put<TodoDocument>(`/todo/${id}/toggle`);
  return response.data;
};
