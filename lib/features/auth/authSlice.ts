// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
interface AuthData {
  _id: string;
  name: string;
  email: string;
  token: string;
}

type AuthState = AuthData | null;

const initialState: AuthState =
  typeof window !== "undefined" && sessionStorage.getItem("userSession")
    ? JSON.parse(sessionStorage.getItem("userSession")!)
    : null;
console.log(initialState);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      sessionStorage.setItem("userSession", JSON.stringify(action.payload));
      return action.payload;
    },
    logout: () => {
      sessionStorage.removeItem("userSession");
      return null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState): AuthState => state.auth;
