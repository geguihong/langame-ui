import request from '@/utils/request';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils/LocalStorage'

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export function setToken(token) {
  if (token) {
    setLocalStorage('user.token', token);
  }
  else {
    removeLocalStorage('user.token');
  }
}

export function getToken() {
  return getLocalStorage('user.token');
}