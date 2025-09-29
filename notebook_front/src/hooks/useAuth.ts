import { useState, useEffect } from 'react'
import type { User } from '../types'
import { findUserByEmail, saveUser, getCurrentUser, setCurrentUser, generateId } from '../lib/storage'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const currentUser = getCurrentUser()
        setUser(currentUser)
        setLoading(false)
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            // 1. 呼叫後端 API 找使用者
            const res = await fetch(`http://localhost:5263/api/Users/findByEmail/${email}`)

            if (!res.ok) {
                // 404 或其他錯誤
                return { error: { message: '用戶不存在，請先註冊' } }
            }

            const existingUser = await res.json()

            // 2. 比對密碼
            if (existingUser.password !== password) {
                return { error: { message: '密碼錯誤' } }
            }

            // 3. 登入成功 → 更新狀態
            // setCurrentUser(existingUser)
            setUser(existingUser)

            return { error: null }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { error: { message: '登入失敗，請稍後再試' } }
        }
    }

    //註冊用戶
    const signUp = async (email: string, password: string) => {
        try {
            // 1. 呼叫後端 API 建立新用戶
            const res = await fetch('http://localhost:5263/api/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password, // 後端 User Model 需有 Password 欄位
                }),
            });

            // 2. 解析 ApiResponse<User>
            const apiResponse = await res.json() as { success: boolean; message?: string; data?: User };

            if (!apiResponse.success) {
                // 註冊失敗，例如 email 已存在
                return { error: { message: apiResponse.message || '註冊失敗' } };
            }

            // 3. 註冊成功 → 更新前端狀態
            const newUser = apiResponse.data!;
            setCurrentUser(newUser);
            setUser(newUser);

            return { error: null };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { error: { message: '註冊失敗，請稍後再試' } };
        }
    };


    const signOut = async () => {
        setCurrentUser(null)
        setUser(null)
        return { error: null }
    }

    return {
        user,
        loading,
        signIn,
        signUp,
        signOut,
    }
}