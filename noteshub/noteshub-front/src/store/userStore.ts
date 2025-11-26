import { create } from 'zustand';

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

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLogged: false,
  token: "",
  setToken: (token) => set({token}),
  setUser: (user) => set({ user, isLogged: true }),
  updateUser: (partial) =>
    set((state) => ({
      user: { ...state.user, ...partial } as User,
      isLogged: true,
    })),
  resetUser: () => set({ user: null, isLogged: false, token: "" }),
}));

export default useUserStore;
