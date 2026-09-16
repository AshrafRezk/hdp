import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UnitFilters } from "../types";

interface AppState {
  // PWA Install
  installPromptEvent: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  showInstallBanner: boolean;
  setInstallPrompt: (event: BeforeInstallPromptEvent | null) => void;
  setShowInstallBanner: (show: boolean) => void;
  dismissInstallBanner: () => void;

  // Search Filters
  filters: UnitFilters;
  setFilters: (filters: UnitFilters | ((prev: UnitFilters) => UnitFilters)) => void;
  clearFilters: () => void;

  // UI State
  isFilterDrawerOpen: boolean;
  setFilterDrawerOpen: (open: boolean) => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // PWA Install
      installPromptEvent: null,
      isInstallable: false,
      showInstallBanner: true,
      setInstallPrompt: (event) =>
        set({ installPromptEvent: event, isInstallable: event !== null }),
      setShowInstallBanner: (show) => set({ showInstallBanner: show }),
      dismissInstallBanner: () => set({ showInstallBanner: false }),

      // Search Filters
      filters: {},
      setFilters: (filtersOrUpdater) =>
        set((state) => ({
          filters:
            typeof filtersOrUpdater === 'function'
              ? filtersOrUpdater(state.filters)
              : filtersOrUpdater,
        })),
      clearFilters: () => set({ filters: {} }),

      // UI State
      isFilterDrawerOpen: false,
      setFilterDrawerOpen: (open) => set({ isFilterDrawerOpen: open }),
    }),
    {
      name: "hdp-app-storage",
      partialize: (state) => ({
        showInstallBanner: state.showInstallBanner,
      }),
    }
  )
);

