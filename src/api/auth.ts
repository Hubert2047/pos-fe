import api from './axios'

export async function loginAPI(data: { account: string; password: string }, config = {}) {
    return api.post('/auth/login', JSON.stringify(data), config)
}
export function logoutAPI(config = {}) {
    return api.delete('/auth/logout', config)
}
