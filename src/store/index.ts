import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ui from "./slices/uiSlice";
import auth from "./slices/authSlice";
import cart from "./slices/cartSlice";
import catalogue from "./slices/catalogueSlice";
import checkout from "./slices/checkoutSlice";
import partner from "./slices/partnerSlice";

/**
 * Add a feature slice by creating src/store/slices/xSlice.ts and listing it here.
 */
const rootReducer = combineReducers({ ui, auth, cart, catalogue, checkout, partner });

/** A function (not a shared object) so each server request gets its own store, as Next.js recommends. */
export const makeStore = () => configureStore({ reducer: rootReducer });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
