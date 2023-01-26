import { http } from './http';

export const userlogin = (data) =>
  http.post('login', new URLSearchParams({ ...data }), {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
