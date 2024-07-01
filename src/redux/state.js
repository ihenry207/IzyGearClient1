import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImagePath: null,
  // gearList: [],
  // wishList: [],
  // ownerGearList: [],
  // reservationList: [],
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
      state.gearList = action.payload.user?.gearList || [];
      state.wishList = action.payload.user?.wishList || [];
      state.ownerGearList = action.payload.user?.ownerGearList || [];
      state.reservationList = action.payload.user?.reservationList || [];
      state.firebaseUid = action.payload.firebaseUid || null;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.profileImagePath = null;
      state.gearList = [];
      state.wishList = [];
      state.ownerGearList = [];
      state.reservationList = [];
      state.listings = [];
      state.firebaseUid = null;
      state.hasUnreadMessages = false; 
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
    setGearList: (state, action) => {
      state.GearList = action.payload;
    },
    setWishList: (state, action) => {
      state.wishList = action.payload;
    },
    setOwnerGearList: (state, action) => {
      state.ownerGearList = action.payload;
    },
    setReservationList: (state, action) => {
      state.reservationList = action.payload;
    },
    setUnreadMessages: (state, action) => {
      state.hasUnreadMessages = action.payload;
    },
    
  },
});

export const {
  setLogin,
  setLogout,
  setListings,
  setGearList,
  setWishList,
  setReservationList,
  setOwnerGearList,
  setUnreadMessages,
} = userSlice.actions;

export default userSlice.reducer;
