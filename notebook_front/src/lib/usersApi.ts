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

// 登入
export const signInApi = async (email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}/findByEmail/${email}`)
        if (!res.ok) return { success: false, message: '用戶不存在，請先註冊' }

        const user = await res.json() as User & { password: string }

        if (user.password !== password) return { success: false, message: '密碼錯誤' }

        return { success: true, data: user }

    } catch {
        return { success: false, message: '登入失敗，請稍後再試' }
    }
}
