import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { projectAPI } from "../../services/api";

// GET PROJECTS
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      return await projectAPI.getProjects();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch projects"
      );
    }
  }
);

// CREATE PROJECT
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      return await projectAPI.createProject(projectData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create project"
      );
    }
  }
);

// UPDATE PROJECT
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      return await projectAPI.updateProject(
        id,
        projectData
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update project"
      );
    }
  }
);

// DELETE PROJECT
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await projectAPI.deleteProject(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete project"
      );
    }
  }
);

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",

  initialState,

  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })

      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        createProject.fulfilled,
        (state, action) => {
          state.loading = false;
          state.projects.push(action.payload);
        }
      )

      .addCase(
        createProject.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // UPDATE
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        updateProject.fulfilled,
        (state, action) => {
          state.loading = false;

          const index = state.projects.findIndex(
            (project) =>
              project.id === action.payload.id
          );

          if (index !== -1) {
            state.projects[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateProject.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // DELETE
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        deleteProject.fulfilled,
        (state, action) => {
          state.loading = false;

          state.projects = state.projects.filter(
            (project) =>
              project.id !== action.payload
          );
        }
      )

      .addCase(
        deleteProject.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearProjectError } =
  projectSlice.actions;

export default projectSlice.reducer;