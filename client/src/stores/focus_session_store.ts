// import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
// import { ActiveSessionDocument } from "@server/models/activeFocusSession.model";
import { message } from "antd";
import {
  SessionDocumentType,
  createFocusSession,
  getFocusSession,
  stopFocusSession,
  updateFocusSession,
} from "src/api/focus_sessions";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface focusSessionStoreType {
  session?: SessionDocumentType;
  setDuration: (duration: number) => void;
  toggleSession: () => Promise<void>;
  loading: boolean;
  getAndSetSession: () => Promise<void>;
}

export const userInfoDefault = {};

const useFocusSessionStore = create<focusSessionStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
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
        setDuration: (duration) => {
          const session = get().session;
          if (!session) {
            return;
          }
          const newSession = { ...session, duration };
          set({ loading: false, session: newSession });
        },
        toggleSession: async () => {
          const session = get().session;
          if (!session) {
            return;
          }
          const newSession = {
            ...session,
            startTime: new Date().toISOString(),
            active: !session.active,
          };
          try {
            if (!session.active) {
              const s = await updateFocusSession(newSession);
              set({ session: s });
            } else {
              const s = await stopFocusSession();
              set({ session: s });
            }
          } catch (error) {
            if (error instanceof Error) {
              message.error(error.message);
            }
          }
        },
      }),
      { name: "userStore" }
    )
  )
);

export default useFocusSessionStore;
