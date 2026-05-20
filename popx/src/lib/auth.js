const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "popx_token";
const USER_KEY = "popx_user";

class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = authStorage.getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server. Please try again.", 0);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong.", response.status);
  }

  return data;
};

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser() {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  saveSession(session) {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  },
  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const signupUser = (payload) =>
  request("/auth/signup", {
    method: "POST",
    body: payload,
  });

export const signinUser = (payload) =>
  request("/auth/signin", {
    method: "POST",
    body: payload,
  });

export const getCurrentUser = () => request("/auth/me");

export const logoutUser = () =>
  request("/auth/logout", {
    method: "POST",
  });
