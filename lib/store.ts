import { configureStore } from "@reduxjs/toolkit";
import { expensesApi } from "./features/expenses/expensesApi";
import { authApi } from "./features/auth/Auth";
import authReducer from "./features/auth/authSlice"; // ✅ IMPORT THIS
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [expensesApi.reducerPath]: expensesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer, // ✅ Now it's the real reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          expensesApi.util.resetApiState.type,
          authApi.util.resetApiState.type,
        ],
      },
    }).concat(expensesApi.middleware, authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
