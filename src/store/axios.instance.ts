import axios from "axios";

const $axios = axios.create({
  baseURL: "https://valasztasok-homework-backend.herokuapp.com/api",
  withCredentials: true,
});

export default $axios;
