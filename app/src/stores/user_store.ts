// import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface userStoreType {
  user?: null | User;
  userInfo?: null | {
    name: string;
    email: string;
  };
  setUser: (user: null | User) => void;
  setUserInfo: (userInfo: null | userStoreType["userInfo"]) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  getUserName: () => string;
  getUserEmail: () => string;
  getUserNameAndEmail: () => { name: string; email: string };
  getUserProfilePicture: () => string;
}

const useUserStore = create<userStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        setUser: (user: null | User) => set({ user }),
        setUserInfo: (userInfo: null | userStoreType["userInfo"]) =>
          set({ userInfo }),
        theme: "light",
        setTheme: (theme: "light" | "dark") => set({ theme }),
        getUserName: () => {
          const user = get().user;
          return user?.displayName || "Guest";
        },
        getUserEmail: () => {
          return get().user?.email || "";
        },
        getUserNameAndEmail: () => {
          return {
            name: get().getUserName(),
            email: get().getUserEmail(),
          };
        },
        getUserProfilePicture: () => {
          return (
            get().user?.photoURL ||
            "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          );
        },
      }),
      { name: "userStore" }
    )
  )
);

export default useUserStore;
