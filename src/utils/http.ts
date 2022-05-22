import axios from "axios";
import CONFIG from "../config";

const http = axios.create({
  baseURL: CONFIG.baseUrl,
  params: {
    appid: CONFIG.API_KEY,
    units: "metric",
  },
});

export default http;
