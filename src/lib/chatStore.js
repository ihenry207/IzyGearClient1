import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null, // receiver
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  showList: true,
  showChat: false,
  showDetail: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // CHECK IF CURRENT USER IS BLOCKED
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
        showList: false,
        showChat: false,
        showDetail: false,
      });
    }

    // CHECK IF RECEIVER IS BLOCKED
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
        showList: false,
        showChat: true,
        showDetail: false,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
        showList: false,
        showChat: true,
        showDetail: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
      showList: true,
      showChat: false,
      showDetail: false,
    });
  },
  setShowList: (show) => set({ showList: show }),
  setShowChat: (show) => set({ showChat: show }),
  setShowDetail: (show) => set({ showDetail: show }),
}));