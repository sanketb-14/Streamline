export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';

export const authService = {
  setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
  },

  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === email && u.password === password);
  }
};