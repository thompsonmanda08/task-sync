import { create } from "zustand";

const INITIAL_STATE = {
  isFilterMenuOpen: false,
  isSideNavOpen: false,
};

const useNavigationStore = create((set, get) => ({
  ...INITIAL_STATE,

  // SETTERS
  setIsFilterMenuOpen: (isFilterMenuOpen) => set({ isFilterMenuOpen }),

  // ACTIONS
  toggleFilterMenu: () =>
    set((state) => ({
      isFilterMenuOpen: !state.isFilterMenuOpen,
    })),

  toggleSideNav: () =>
    set((state) => ({
      isSideNavOpen: !state.isSideNavOpen,
    })),

  // CLear & Reset
  resetStore: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useNavigationStore;
