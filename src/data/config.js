import axios from "axios";

// Set the base URL for axios requests
axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
