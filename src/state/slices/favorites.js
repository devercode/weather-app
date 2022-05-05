import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  locations: [],
};

export const FavoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    add: (state, action) => {
      state.locations = [...state.locations, action.payload];
    },
    remove: (state, action) => {
      const key = action.payload.Key;
      state.locations = state.locations.filter(
        (location) => location.Key !== key
      );
    },
  },
});

export const { reducer, actions } = FavoritesSlice;
