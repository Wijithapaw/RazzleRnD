import { apiService } from "./api.service";

export const authService = {
    login
}

function login(username: string, password: string) {
  return apiService.post("account", "login", { username, password });
}
