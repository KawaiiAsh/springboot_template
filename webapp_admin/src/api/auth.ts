import axios from './axios';

export const login = (username: string, password: string) => {
    return axios.post('/auth/login', { username, password });
};

export const getSystemStatus = () => {
    return axios.get('/monitor/status');
};