import {
  createSlice,
} from "@reduxjs/toolkit";

const savedUser =
  localStorage.getItem(
    "enterpriseUser"
  );

const savedToken =
  localStorage.getItem(
    "enterpriseToken"
  );

const initialState = {
  user: savedUser
    ? JSON.parse(savedUser)
    : null,

  token: savedToken || null,

  isAuthenticated:
    Boolean(savedToken),

  loading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    login: (state, action) => {
      const {
        user,
        token,
      } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      localStorage.setItem(
        "enterpriseUser",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "enterpriseToken",
        token
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem(
        "enterpriseUser"
      );

      localStorage.removeItem(
        "enterpriseToken"
      );
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  login,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;