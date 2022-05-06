import { createSlice } from "@reduxjs/toolkit";

export const TEMPERATURE = Object.freeze({
  // TEMPERATURE enum
  Celsius: "Celsius",
  Fahrenheits: "Fahrenheits",
});

const initialState = {
  mode: "light", // default Theme Mode = Light
  temperature: TEMPERATURE.Celsius,
};

export const SettingSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      // Toggle Dark mode
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setTempMode: (state, action) => {
      // set Celsius or Fahrenheits
      state.temperature = action.payload;
    },
  },
});

export const { reducer, actions } = SettingSlice;
