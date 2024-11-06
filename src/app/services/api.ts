import axios from "axios";
import nookies from 'nookies';
import { parseCookies } from 'nookies';

// Obter o token do lado do cliente
const cookies = parseCookies();
const token = cookies.access_token;

const api = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export { api };
