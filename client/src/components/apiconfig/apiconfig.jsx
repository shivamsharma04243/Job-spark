import axios from "axios";

/**
 * Axios Instance
 * --------------
 * Purpose:
 *   - Centralize API configuration.
 *   - Automatically include credentials (cookies) for authentication.
 *   - Use baseURL so all requests start from /api without repeating the address.
 *
 * baseURL:
 *   - Uses Vite environment variable VITE_API_BASE.
 *   - Falls back to localhost backend for development.
 *
 * withCredentials:
 *   - Ensures JWT HttpOnly cookies are sent automatically with every request.
 *   - Required for protected routes and auth middleware.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  withCredentials: true, // allow sending cookies
});

/**
 * Axios Response Interceptor
 * ---------------------------
 * Purpose:
 *   - Catch errors globally (e.g., 401 Unauthorized).
 *   - You can auto-logout or redirect based on server responses.
 *
 * Current behavior:
 *   - Simply rethrows the error (but gives a clean place to handle auth failures later).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example (optional):
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("user");
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export default api;
