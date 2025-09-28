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


    const signUp = async (email: string, password: string) => {
        try {
            const existingUser = findUserByEmail(email)

            if (existingUser) {
                return { error: { message: '此電子郵件已被註冊' } }
            }

            const newUser: User = {
                id: generateId(),
                email,
                createdAt: new Date().toISOString()
            }

            saveUser(newUser)
            localStorage.setItem(`password_${newUser.id}`, password)

            setCurrentUser(newUser)
            setUser(newUser)
            return { error: null }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { error: { message: '註冊失敗' } }
        }
    }

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