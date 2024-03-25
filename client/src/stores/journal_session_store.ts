/* eslint-disable @typescript-eslint/no-unused-vars */
import { JournalSessionDocument } from "@server/models/journal.model";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface journalStoreType {
  loading: boolean;
  journals: JournalSessionDocument[];
  setJournalSessions: (journals: JournalSessionDocument[]) => void;
  setLoading: (loading: boolean) => void;
  addJournalSession: (journal: JournalSessionDocument) => void;
  updateJournalSession: (journal: JournalSessionDocument) => void;
}

const initialValues = {
  journals: [],
  loading: false,
};

const useJournalSessionStore = create<journalStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, _get) => ({
        ...initialValues,
        setJournalSessions: (journals: JournalSessionDocument[]) =>
          set({ journals, loading: false }),
        setLoading: (loading: boolean) => set({ loading }),
        addJournalSession: (journal: JournalSessionDocument) =>
          set((state) => ({ journals: [...state.journals, journal] })),
        updateJournalSession: (journal: JournalSessionDocument) =>
          set((state) => ({
            journals: state.journals.map((p) =>
              p._id === journal._id ? journal : p
            ),
          })),
      }),
      { name: "journalStore" }
    )
  )
);

export default useJournalSessionStore;
