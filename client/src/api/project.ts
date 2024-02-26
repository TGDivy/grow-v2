import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { createProjectInput } from "@server/schema/project.schema";
import { ProjectDocument } from "@server/models/project.model";
import { TodoDocument } from "@server/models/todo.model";
import { convertDateStringsToDates } from "src/utils/text";

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

projectAPI.interceptors.response.use((response) => {
  response.data = convertDateStringsToDates(response.data);

  return response;
}, handleAxiosError);

export const getProjects = async () => {
  const response = await projectAPI.get<ProjectDocument[]>("/project");
  return response.data;
};

export const createProject = async (project: createProjectInput["body"]) => {
  const response = await projectAPI.post<ProjectDocument>("/project", project);
  return response.data;
};

export const getProject = async (projectId: string) => {
  const response = await projectAPI.get<ProjectDocument>(
    `/project/${projectId}`
  );
  return response.data;
};

export const getProjectFull = async (projectId: string) => {
  const response = await projectAPI.get<{
    project: ProjectDocument;
    todos: TodoDocument[];
  }>(`/project/${projectId}/details`);
  return response.data;
};
