import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// This store will save the selected accent color to localStorage.
export const useThemeStore = create(
  persist(
    (set) => ({
      accent: 'Emerald', // This is the default accent color for the app.
      setAccent: (newAccent) => set({ accent: newAccent }),
    }),
    {
      name: 'sapphire-chat-theme', // A unique name for the localStorage item.
    }
  )
);