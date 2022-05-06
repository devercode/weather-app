import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: null,
};

export const HomeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = { ...action.payload };
    },
  },
});

export const { reducer, actions } = HomeSlice;
