import { http } from './http';

export const getUser = () => http.get('user/');
