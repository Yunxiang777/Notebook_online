import type { User } from '../types'

const BASE_URL = 'http://localhost:5263/api/Users'

// 註冊
export const signUpApi = async (email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const apiResponse = await res.json() as { success: boolean; message?: string; data?: User }
        return apiResponse

    } catch {
        return { success: false, message: '註冊失敗，請稍後再試' }
    }
}

export const signInApi = async (email: string, password: string) => {
    try {
        // 確保 BASE_URL 不重複 /users
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // 自動帶 Cookie
        });

        if (!res.ok) {
            // 如果後端回傳 404 / 401 / 其他非 2xx
            const text = await res.text();
            return { success: false, message: text || '登入失敗' };
        }

        const result = await res.json(); // 成功才解析 JSON
        return { success: true, data: result.data };

    } catch {
        return { success: false, message: '登入失敗，請稍後再試' };
    }
};
