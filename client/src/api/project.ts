import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import ProjectType from "../../../server/src/models/project";

export const projectAPI = axios.create({
  baseURL: `${API_DOMAIN}`,
  headers: {
    "Content-type": "application/json",
  },
});

projectAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }

  return config;
});

projectAPI.interceptors.response.use((response) => response, handleAxiosError);

export const getProjects = async () => {
  const response = await projectAPI.get<ProjectType[]>("/project");
  return response.data;
};

export const createProject = async (project: ProjectType) => {
  const response = await projectAPI.post<ProjectType>("/project", project);
  return response.data;
};
