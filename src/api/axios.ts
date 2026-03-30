import axios from 'axios'
import { TOKEN_STORAGE_KEY } from '@/constance'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const api = axios.create({
    baseURL: `${API_BASE_URL}/api/`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 5000,
})
api.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY)
        // config.withCredentials = true
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: any) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        const originalRequest = error.config
        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it

        if (error?.response?.data.message === 'Invalid refresh token') {
            window.location.href = '/login'
            return
        }
        if (
            error?.response?.status === 401 &&
            error?.response?.data.message === 'Invalid token' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                const response = await api.post('refresh-token')
                const { accessToken } = response.data

                localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return api(originalRequest)
            } catch (error) {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

export default api;