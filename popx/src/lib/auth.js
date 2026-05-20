const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "popx_token";
const USER_KEY = "popx_user";
const REQUEST_TIMEOUT_MS = 10000;
const CURRENT_USER_TTL_MS = 60 * 1000;
let currentUserCache = null;
let inFlightCurrentUserPromise = null;

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }

    throw new ApiError("Could not reach the server. Please try again.", 0);
  } finally {
    clearTimeout(timeoutId);
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
    currentUserCache = { user: session.user, timestamp: Date.now() };
  },
  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentUserCache = { user, timestamp: Date.now() };
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    currentUserCache = null;
    inFlightCurrentUserPromise = null;
  },
};

export const signupUser = (payload) =>
  request("/auth/signup", {
    method: "POST",
    body: {
      ...payload,
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      companyName: payload.companyName.trim(),
    },
  });

export const signinUser = (payload) =>
  request("/auth/signin", {
    method: "POST",
    body: {
      ...payload,
      email: payload.email.trim(),
    },
  });

export const getCurrentUser = ({ force = false } = {}) => {
  const hasValidCache =
    currentUserCache && Date.now() - currentUserCache.timestamp < CURRENT_USER_TTL_MS;

  if (!force && hasValidCache) {
    return Promise.resolve({ user: currentUserCache.user });
  }

  if (!force && inFlightCurrentUserPromise) {
    return inFlightCurrentUserPromise;
  }

  inFlightCurrentUserPromise = request("/auth/me")
    .then((data) => {
      currentUserCache = { user: data.user, timestamp: Date.now() };
      return data;
    })
    .finally(() => {
      inFlightCurrentUserPromise = null;
    });

  return inFlightCurrentUserPromise;
};

export const logoutUser = () =>
  request("/auth/logout", {
    method: "POST",
  });
