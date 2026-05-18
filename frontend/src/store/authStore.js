import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      setAuth: (user) => set({ user }),

      logout: () => set({ user: null }),

      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.role === "ADMIN";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;