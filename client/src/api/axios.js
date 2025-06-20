import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  // You can add headers here if needed
});

export default instance;
