const Token_KEY = "authToken";
const USER_KEY = "user";

export function setToken(token) {
    localStorage.setItem(Token_KEY, token);
}

export function getToken() {
    return localStorage.getItem(Token_KEY);
}

export function removeToken() {
    localStorage.removeItem(Token_KEY);
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
    const userString = localStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
}

export function removeUser() {
    localStorage.removeItem(USER_KEY);
}