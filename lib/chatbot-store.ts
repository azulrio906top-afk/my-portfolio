import { create } from "zustand";

type ChatbotState = {
  isOpen: boolean;

  openChat: () => void;

  closeChat: () => void;

  toggleChat: () => void;
};

export const useChatbotStore =
  create<ChatbotState>(
    (set) => ({
      isOpen: false,

      openChat: () =>
        set({
          isOpen: true,
        }),

      closeChat: () =>
        set({
          isOpen: false,
        }),

      toggleChat: () =>
        set((state) => ({
          isOpen:
            !state.isOpen,
        })),
    }),
  );