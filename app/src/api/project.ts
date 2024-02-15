import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { ProjectType } from "../../../api/src/models/project";
// import { ProjectType } from "../../../api/src/models/project";
// import { ProjectType } from "@server/project";

export const projectAPI = axios.create({
  baseURL: `${API_DOMAIN}`,
  headers: {
    "Content-type": "application/json",
  },
});

projectAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  console.log("auth_token", auth_token);

  // if (auth_token) {
  //   config.headers.Authorization = `Bearer ${auth_token}`;
  // }

  return config;
});

projectAPI.interceptors.response.use((response) => response, handleAxiosError);

export const getProjects = async () => {
  const response = await projectAPI.get<ProjectType[]>("/project");
  return response.data;
};
