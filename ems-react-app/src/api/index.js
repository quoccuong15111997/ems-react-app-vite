import axios from "axios";
import { baseUrl } from "../constants";

const api = (token) =>
  axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      TOKEN: token,
    },
  });

export default api;

