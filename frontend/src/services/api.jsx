import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed', refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;