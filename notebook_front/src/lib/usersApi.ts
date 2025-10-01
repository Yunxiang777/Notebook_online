import type { User } from '../types'

const BASE_URL = 'http://localhost:5263/api/Users'

// 註冊
export const signUpApi = async (email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
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
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })

        const apiResponse = await res.json() as { success: boolean; message?: string; data?: User }
        return apiResponse

    } catch {
        return { success: false, message: '登入失敗，請稍後再試' }
    }
}
