import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: null,
};

export const HomeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      // set current location in Home Page
      state.currentLocation = { ...action.payload };
    },
  },
});

export const { reducer, actions } = HomeSlice;
