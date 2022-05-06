import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { reducer as settingReducer } from "./slices/setting";
import { reducer as FavoritesReducer } from "./slices/favorites";
import { persistReducer } from "redux-persist";
import { reducer as homeReducer } from "./slices/home";
import storage from "redux-persist/lib/storage";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false, // disable warning
});

const reducer = combineReducers({
  setting: settingReducer,
  favorites: FavoritesReducer,
  home: homeReducer,
});

const persistedReducer = persistReducer(
  {
    key: " root",
    storage, // persist store to localStorage
    blacklist: ["home"], //prevent home reducer not to be persisted
  },
  reducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: customizedMiddleware,
});
