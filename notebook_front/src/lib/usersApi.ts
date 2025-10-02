import type { LoginResponse, RegisterResponse } from '../types'

const BASE_URL = 'http://localhost:5263/api/Users'

// 註冊
export const signUpApi = async (email: string, password: string): Promise<RegisterResponse> => {
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })

        const apiResponse = await res.json() as RegisterResponse
        return apiResponse

    } catch {
        return { success: false, message: '系統錯誤，請稍後再試' }
    }
}

// 登入
export const signInApi = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })

        const apiResponse = await res.json() as LoginResponse
        return apiResponse

    } catch {
        return { success: false, message: '登入失敗，請稍後再試' }
    }
}
