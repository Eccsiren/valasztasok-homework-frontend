import axios from "axios";

const $axios = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default $axios;
