// src/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api", //importante!!
  withCredentials: true, //para cookies httpOnly
});

