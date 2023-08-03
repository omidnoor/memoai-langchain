const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  id: null,
  name: "",
  email: "",
  username: "",
  status: "",
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  errorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    registerRequest: (state) => {
      state.isLoading = true;
    },
    registerSuccess: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    registerFailure: (state, action) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
    updateUserRequest: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.isLoading = false;
    },
    updateUserFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

export const selectUser = (state) => state.user;
export const selectUserId = (state) => state.user.id;
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserUsername = (state) => state.user.username;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserIsLoading = (state) => state.user.isLoading;
export const selectUserIsError = (state) => state.user.isError;
export const selectUserErrorMessage = (state) => state.user.errorMessage;

export default userSlice.reducer;
