import axios from 'axios';

const api = axios.create({
	baseURL: 'http://192.168.100.3:8000',
	withCredentials: false,
});

export const setupInterceptors = (navigate: (path: string) => void) => {
	api.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem('access');
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				localStorage.removeItem('access');
				localStorage.removeItem('refresh');
				navigate('/signin');
			}
			return Promise.reject(error);
		}
	);
};

export default api;
