import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Hardcoded admin credentials
const adminEmail = 'admin@example.com';
const adminPassword = 'admin123';

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null, // Add token to the state
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Assuming you have a token in your state

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const { email, password } = formData;

    // Check for hardcoded admin credentials
    if (email === adminEmail && password === adminPassword) {
      return {
        success: true,
        user: {
          email: adminEmail,
          role: 'admin',
        },
      };
    }

    // If not admin, proceed with API call
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async () => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// Thunk to check authentication
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token; // Get token from state

    const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token; // Set token in state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null; // Clear token on logout
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
