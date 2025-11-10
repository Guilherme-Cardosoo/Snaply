import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Exemplo de login
export const login = async (username, password) => {
  return api.post("token/", { username, password });
};

// Exemplo de registro
export const register = async (data) => {
  return api.post("users/", data);
};

// Exemplo de usuário logado
export const getCurrentUser = async (token) => {
  return api.get("users/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;
