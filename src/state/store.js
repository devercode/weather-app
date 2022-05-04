import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { reducer as themeReducer } from "./slices/theme";
import { reducer as FavoritesReducer } from "./slices/favorites";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});
const reducer = combineReducers({
  theme: themeReducer,
  favorites: FavoritesReducer,
});

const persistedReducer = persistReducer(
  {
    key: " root",
    storage,
  },
  reducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: customizedMiddleware,
});
