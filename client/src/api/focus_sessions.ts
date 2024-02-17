import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { createActiveSessionInput } from "@server/schema/focusSession.schema";
import { ActiveSessionDocument } from "@server/models/activeFocusSession.model";
import { PastSessionDocument } from "@server/models/pastFocusSession.model";

const activeFocusSessionAPI = axios.create({
  baseURL: `${API_DOMAIN}/focus-sessions/`,
  headers: {
    "Content-type": "application/json",
  },
});

activeFocusSessionAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }

  return config;
});

activeFocusSessionAPI.interceptors.response.use(
  (response) => response,
  handleAxiosError
);

export const getFocusSession = async () => {
  const response = await activeFocusSessionAPI.get<ActiveSessionDocument[]>(
    "active"
  );
  return response.data;
};

export const getPastFocusSessions = async () => {
  const response = await activeFocusSessionAPI.get<PastSessionDocument[]>(
    "past"
  );
  return response.data;
};

export const createFocusSession = async (
  project: createActiveSessionInput["body"]
) => {
  const response = await activeFocusSessionAPI.post<ActiveSessionDocument>(
    "active",
    project
  );
  return response.data;
};

export const updateFocusSession = async (
  project: createActiveSessionInput["body"]
) => {
  const response = await activeFocusSessionAPI.put<ActiveSessionDocument>(
    "active",
    project
  );
  return response.data;
};

export const stopFocusSession = async () => {
  const response = await activeFocusSessionAPI.put<ActiveSessionDocument>(
    "active/stop"
  );
  return response.data;
};