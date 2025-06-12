import { revokeAccessToken } from "@/app/_actions/config-actions";
import { create } from "zustand";

const INITIAL_STATE = {
  isLoading: false,
  error: {
    status: false,
    message: "",
  },
  auth: {
    accessToken: "",
  },
  user: {},
  checkout: {
    payer: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    paymentInfo: {
      type: "", // MOBILE || CARD
      operator: "", // AITEL || MTN
      phone: "",
      card: "",
    },
    order: {
      plan: undefined,
      discount: 0,
    },
  },
};

const useAccountStore = create((set, get) => ({
  ...INITIAL_STATE,

  setAuth: (auth) => set({ auth }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUser: (user) => set({ user }),

  updateCheckoutPayerInfo: (fields) => {
    set((state) => {
      return {
        checkout: {
          ...state.checkout,
          payer: {
            ...state.checkout.payer,
            ...fields,
          },
        },
      };
    });
  },

  updateCheckoutPaymentInfo: (fields) => {
    set((state) => {
      return {
        checkout: {
          ...state.checkout,
          paymentInfo: {
            ...state.checkout.paymentInfo,
            ...fields,
          },
        },
      };
    });
  },

  updateCheckoutOrderInfo: (fields) => {
    set((state) => {
      return {
        checkout: {
          ...state.checkout,
          order: {
            ...state.checkout.order,
            ...fields,
          },
        },
      };
    });
  },

  logUserOut: async () => {
    get().resetAuthStore();
    await revokeAccessToken();
  },

  // CLear & Reset
  resetAuthStore: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useAccountStore;
