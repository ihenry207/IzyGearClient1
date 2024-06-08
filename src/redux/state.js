import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImagePath: null,
  gearList: [],
  wishList: [],
  ownerGearList: [],
  reservationList: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.profileImagePath = action.payload.profileImagePath;
      state.gearList = action.payload.gearList;
      state.wishList = action.payload.wishList;
      state.ownerGearList = action.payload.ownerGearList;
      state.reservationList = action.payload.reservationList;
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
} = userSlice.actions;

export default userSlice.reducer;
