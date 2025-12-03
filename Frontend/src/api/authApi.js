import { apiFetch } from "./apiClient.js";

export async function register(userData) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: userData
    });
}

export async function login ({email, password}) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: {email, password}
    });
}

export async function profile() {
    return apiFetch("/auth/profile", {
        method: "GET"
    });
}

