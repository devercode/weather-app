import { configureStore } from "@reduxjs/toolkit";
import { reducer as themeReducer } from "./slices/theme";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});
