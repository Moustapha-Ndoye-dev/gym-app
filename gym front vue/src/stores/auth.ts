import { defineStore } from 'pinia'
import { ref } from 'vue'

export type User = {
  id: number;
  username: string;
  role: 'admin' | 'cashier' | 'controller' | 'member';
};

export const useAuthStore = defineStore('auth', () => {
  const getInitialUser = (): User | null => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  };

  const user = ref<User | null>(getInitialUser());
  const token = ref<string | null>(localStorage.getItem('token'));

  const login = (userData: User, userToken: string) => {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return { user, token, login, logout };
})
