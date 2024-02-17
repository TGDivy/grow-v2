// import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { ActiveSessionDocument } from "@server/models/activeFocusSession.model";
import {
  createFocusSession,
  getFocusSession,
  updateFocusSession,
} from "src/api/focus_sessions";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface focusSessionStoreType {
  session?: ActiveSessionDocument;
  setDuration: (duration: number) => Promise<void>;
  loading: boolean;
  getAndSetSession: () => Promise<void>;
}

export const userInfoDefault = {};

const useFocusSessionStore = create<focusSessionStoreType>()(
  subscribeWithSelector(
    devtools(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (set, _get) => ({
        loading: false,
        session: undefined,
        getAndSetSession: async () => {
          set({ loading: true });
          try {
            const session = await getFocusSession();
            set({ loading: false, session });
          } catch (error) {
            const session = await createFocusSession({
              duration: 25 * 60,
              active: false,
            });
            set({ session, loading: false });
          }
        },
        setDuration: async (duration) => {
          set({ loading: true });
          const session = await updateFocusSession({ duration, active: false });
          set({ loading: false, session });
        },
      }),
      { name: "userStore" }
    )
  )
);

export default useFocusSessionStore;
