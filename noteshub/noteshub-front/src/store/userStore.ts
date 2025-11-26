import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string;
  isLogged: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  resetUser: () => void;
}

// Adaptador de sessionStorage para Zustand
const sessionStorageAdapter = {
  getItem: (name: string) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: "",
      isLogged: false,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user, isLogged: true }),
      updateUser: (partial) =>
        set((state) => ({
          user: { ...state.user, ...partial } as User,
          isLogged: true,
        })),
      resetUser: () => set({ user: null, token: "", isLogged: false }),
    }),
    {
      name: "user-storage",
      storage: sessionStorageAdapter, // usamos nuestro adaptador
    }
  )
);

export default useUserStore;
