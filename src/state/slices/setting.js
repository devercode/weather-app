import { createSlice } from "@reduxjs/toolkit";

export const TEMPERATURE = Object.freeze({
  Celsius: "Celsius",
  Fahrenheits: "Fahrenheits",
});
const initialState = {
  mode: "light",
  temperature: TEMPERATURE.Celsius,
};

export const SettingSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setTempMode: (state, action) => {
      state.temperature = action.payload;
    },
  },
});

export const { reducer, actions } = SettingSlice;
