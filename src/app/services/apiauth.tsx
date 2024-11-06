import axios from "axios";

const apiauth = axios.create({
  baseURL: "http://localhost:3001/",
  // No default headers are set
});

export { apiauth};
