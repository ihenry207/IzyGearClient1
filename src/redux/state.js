import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImagePath: null,
  firebaseUid: null,
  hasUnreadMessages: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.firstName = action.payload.user?.firstName || "";
      state.lastName = action.payload.user?.lastName || "";
      state.email = action.payload.user?.email || "";
      state.profileImagePath = action.payload.user?.profileImagePath || "";
      state.firebaseUid = action.payload.user?.firebaseUid || action.payload.firebaseUid || null;
    },
    setLogout: (state) => {
      return initialState;
    },
    setUnreadMessages: (state, action) => {
      state.hasUnreadMessages = action.payload;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setUnreadMessages,
} = userSlice.actions;

export default userSlice.reducer;