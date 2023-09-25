import jwtDecode from 'jwt-decode';
import api from "@/utils/api";
export function saveToken(token: string): void {
    localStorage.setItem('jwt', token);
}

export function getToken(): string | null {
    return localStorage.getItem('jwt');
}

export function removeToken(): void {
    localStorage.removeItem('jwt');
}

// export function isTokenValid(token: string, isAdmin: string): boolean {
//     try {
//         const decoded: any = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // 获取当前时间（以秒为单位）
//
//         // 检查JWT是否有过期时间并且是否已过期
//         return !(decoded.exp && decoded.exp < currentTime);
//          // token有效
//     } catch (error) {
//         console.error("Error decoding token:", error);
//         return false; // 如果解码失败，认为token无效
//     }
// }

export async function isTokenValid(token: string | null, isAdmin: boolean | null): Promise<boolean> {
    if (!token) return false; // 没有token，认为token无效
    try {
        if (isAdmin !== true) {
            console.log('is not admin');
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000; // 获取当前时间（以秒为单位）
            // 检查JWT是否有过期时间并且是否已过期
            return !(decoded.exp && decoded.exp < currentTime);
        }
        const response = await api.post('/validate-access', {token: token});
        return response.data.status === 'allowed';

    } catch (error) {
        console.error("Error validating token:", error);
        return false; // 如果请求失败或返回错误，认为token无效
    }
}