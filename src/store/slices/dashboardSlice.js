import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  dashboardAPI,
} from "../../services/api";

export const fetchDashboard =
  createAsyncThunk(
    "dashboard/fetchDashboard",

    async (_, { rejectWithValue }) => {
      try {
        return await dashboardAPI.getDashboardData();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    }
  );

const initialState = {
  users: [],
  projects: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDashboard.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDashboard.fulfilled,
        (state, action) => {
          state.loading = false;

          state.users = action.payload.users;

          state.projects =
            action.payload.projects;
        }
      )

      .addCase(
        fetchDashboard.rejected,
        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        }
      );
  },
});

export const {
  clearDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;