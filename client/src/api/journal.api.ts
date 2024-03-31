import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import {
  createJournalSessionInput,
  updateJournalSessionInput,
} from "@server/schema/journal.schema";
import { JournalSessionDocument } from "@server/models/journal.model";
import { convertDateStringsToDates } from "src/utils/text";

export const journalAPI = axios.create({
  baseURL: `${API_DOMAIN}`,
  headers: {
    "Content-type": "application/json",
  },
});

journalAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }

  return config;
});

journalAPI.interceptors.response.use((response) => {
  response.data = convertDateStringsToDates(response.data);

  return response;
}, handleAxiosError);

export const getJournalSessions = async () => {
  const response = await journalAPI.get<JournalSessionDocument[]>("/journal");
  return response.data;
};

export const createJournalSession = async (
  journal: createJournalSessionInput["body"]
) => {
  const response = await journalAPI.post<JournalSessionDocument>(
    "/journal",
    journal
  );
  return response.data;
};

export const updateJournalSession = async (
  id: string,
  journal: updateJournalSessionInput["body"]
) => {
  const response = await journalAPI.put<JournalSessionDocument>(
    `/journal/${id}`,
    journal
  );
  return response.data;
};

export const finishJournalSession = async (id: string) => {
  const response = await journalAPI.put<JournalSessionDocument>(
    `/journal/${id}/finish`
  );
  return response.data;
};

export const toggleJournalSession = async (id: string) => {
  const response = await journalAPI.put<JournalSessionDocument>(
    `/journal/${id}/toggle`
  );
  return response.data;
};
