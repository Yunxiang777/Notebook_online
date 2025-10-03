// lib/apiRequest.ts
import { API_USERS } from '../../config'
import { API_NOTES } from '../../config'

// 通用的 API 請求函式（給 Users 相關的 API 使用）
export async function apiRequest_USERS<T>(
    endpoint: string,
    options: RequestInit
): Promise<T & { success?: boolean; message?: string }> {
    try {
        const res = await fetch(`${API_USERS}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            credentials: 'include',
        })

        const data = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || `伺服器錯誤 (${res.status})`,
            } as T & { success: boolean; message: string }
        }

        return data
    } catch {
        return { success: false, message: '系統錯誤，請稍後再試' } as T & {
            success: boolean
            message: string
        }
    }
}

// 通用的 API 請求函式（給 Notes 相關的 API 使用）
export async function apiRequest_NOTES<T>(
    endpoint: string,
    options: RequestInit
): Promise<T & { success?: boolean; message?: string }> {
    try {
        const res = await fetch(`${API_NOTES}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            credentials: 'include', // 自動帶上 JWT cookie
        })

        const data = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: data?.message || `伺服器錯誤 (${res.status})`,
            } as T & { success: boolean; message: string }
        }

        return data
    } catch {
        return { success: false, message: '系統錯誤，請稍後再試' } as T & {
            success: boolean
            message: string
        }
    }
}