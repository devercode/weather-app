import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
};

export const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggle: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { reducer, actions } = ThemeSlice;
