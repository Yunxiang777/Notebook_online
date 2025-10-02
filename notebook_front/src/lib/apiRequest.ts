// lib/apiRequest.ts
import { API_USERS } from '../../config'

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
