import { apiFetch } from "./apiClient.js";

export async function register(userData) {
    const res = await apiFetch("/auth/register", {
        method: "POST",
        body: userData
    });
    return {
        user: res.user,
        token: res.access_token
    };
}

export async function login ({email, password}) {
    const res = await apiFetch("/auth/login", {
        method: "POST",
        body: {email, password}
    });
    return {
        user: res.user,
        token: res.access_token
    };
}

export async function profile() {
    return apiFetch("/auth/profile", {
        method: "GET"
    });
}

