import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { createUserInput, updateUserInput } from "@server/schema/user.schema";
import { UserDocument } from "@server/models/user.model";
import { convertDateStringsToDates } from "src/utils/text";

export const userAPI = axios.create({
  baseURL: `${API_DOMAIN}`,
  headers: {
    "Content-type": "application/json",
  },
});

userAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }

  return config;
});

userAPI.interceptors.response.use((response) => {
  response.data = convertDateStringsToDates(response.data);

  return response;
}, handleAxiosError);

export const getUser = async (id: string) => {
  const response = await userAPI.get<UserDocument>(`/user/${id}`);
  return response.data;
};

export const createUser = async (user: createUserInput["body"]) => {
  const response = await userAPI.post<UserDocument>("/user", user);
  return response.data;
};

export const updateUser = async (id: string, user: updateUserInput["body"]) => {
  const response = await userAPI.put<UserDocument>(`/user/${id}`, user);
  return response.data;
};

export const toggleUser = async (id: string) => {
  const response = await userAPI.put<UserDocument>(`/user/${id}/toggle`);
  return response.data;
};
