export const authStorage = {
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  setAccessToken: (token) => {
    localStorage.setItem("accessToken", token);
  },

  setRefreshToken: (token) => {
    localStorage.setItem("refreshToken", token);
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  },

  removeAccessToken: () => {
    localStorage.removeItem("accessToken");
  },

  removeRefreshToken: () => {
    localStorage.removeItem("refreshToken");
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("accessToken");
  },

  hasRefreshToken: () => {
    return !!localStorage.getItem("refreshToken");
  }
};