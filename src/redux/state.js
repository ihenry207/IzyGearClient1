import { createSlice} from "@reduxjs/toolkit"

const initialState = {
    user: null,
    token: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setLogin: (state, action) =>{
            state.user = action.payload.user
            state.token = action.payload.token
            //console.log("User logged in:", state.user);
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        setListings: (state, action) => {
            state.listings = action.payload.listings
        },
        setGearList: (state, action) => {
            state.user.GearList = action.payload
        },
        setWishList: (state, action) => {
            state.user.wishList = action.payload
        },
        setOwnerGearList: (state, action) => {
            state.user.ownerGearList = action.payload
        },
        setReservationList: (state, action) => {
            state.user.reservationList = action.payload
        }
    }
})
export const { setLogin, setLogout, setListings, setTripList, setWishList, setPropertyList, setReservationList } = userSlice.actions
export default userSlice.reducer