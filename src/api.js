import axios from "axios";

const api = axios.create({
  baseURL: "https://debmate-backend.onrender.com",
});

export default api;
