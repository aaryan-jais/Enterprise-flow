import axios from "axios";

const API = axios.create({
  baseURL: "https://6aa4a0eb1397053d42bafd1c.mockapi.io/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// USERS
// =========================

export const userAPI = {
  getUsers: async () => {
    const response = await API.get("/users");
    return response.data;
  },

  getUser: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await API.post(
      "/users",
      userData
    );

    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await API.put(
      `/users/${id}`,
      userData
    );

    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(
      `/users/${id}`
    );

    return response.data;
  },
};

// =========================
// PROJECTS
// =========================

export const projectAPI = {
  getProjects: async () => {
    const response = await API.get("/projects");

    return response.data;
  },

  getProject: async (id) => {
    const response = await API.get(
      `/projects/${id}`
    );

    return response.data;
  },

  createProject: async (projectData) => {
    const response = await API.post(
      "/projects",
      projectData
    );

    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await API.put(
      `/projects/${id}`,
      projectData
    );

    return response.data;
  },

  deleteProject: async (id) => {
    const response = await API.delete(
      `/projects/${id}`
    );

    return response.data;
  },
};

// =========================
// DASHBOARD
// =========================

export const dashboardAPI = {
  getDashboardData: async () => {
    const [usersResponse, projectsResponse] =
      await Promise.all([
        API.get("/users"),
        API.get("/projects"),
      ]);

    return {
      users: usersResponse.data,
      projects: projectsResponse.data,
    };
  },
};

export default API;