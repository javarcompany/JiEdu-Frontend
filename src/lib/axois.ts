import axios from 'axios';
// import { useUser } from '../context/AuthContext';

const api = axios.create({
	baseURL: 'http://192.168.100.3:8000',
	withCredentials: false,
});

export const setupInterceptors = (navigate: (path: string) => void) => {
	// const { user } = useUser();
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

			// if (error.response?.status === 403) {
			// 	// user is authenticated but not allowed
			// 	if (user?.user_type === 'student') {
			// 		navigate('/home');
			// 	} else if (user?.user_type === 'staff') {
			// 		navigate('/dashboard');
			// 	} else {
			// 		navigate('/'); // fallback
			// 	}
			// }

			return Promise.reject(error);
		}
	);
};

export default api;
