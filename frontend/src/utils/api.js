import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", 
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Ensures cookies are sent with requests
});

export const login = (email, password) => API.post("/auth/login", { email, password });
export const register = (userData) => API.post("/auth/register", userData);
export const getUser = () => API.get("/auth/profile");

export default API;
