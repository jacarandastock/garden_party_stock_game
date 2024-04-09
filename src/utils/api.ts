import axios from 'axios'

// API服务器地址
export const apiURL = 'quizgame.jacarandastock.com'

// 协议
export const protocol = 'https';

// export const apiURL = '127.0.0.1:5000';
//
// // 协议
// export const protocol = 'http';
export const wsProtocol = protocol === 'http' ? 'ws' : 'wss';


// 携带token的请求
export const api = axios.create({
    baseURL: `${protocol}://${apiURL}`,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

export const ioUrl = `${wsProtocol}://${apiURL}`
export function setToken(token: string) {
    // 将token 保存到localStorage中
    localStorage.setItem('token', token)
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export function getToken(): string | null {
    return localStorage.getItem('token')
}

export function removeToken() {
    // 删除localStorage中的token
    localStorage.removeItem('token')
}

export async function isTokenValid(token: string | null, isAdmin: boolean | null) {
    if (!token) return false // 没有token，认为token无效
    const response = await api.post('/protected', { token: token })
    const userIsAdmin = response.data.is_admin
    console.log(userIsAdmin)
    if (isAdmin === null) return response.data.status !== 'error';
    if (isAdmin) return response.data.status !== 'error' && userIsAdmin
    return response.data.status !== 'error'
}


export default api