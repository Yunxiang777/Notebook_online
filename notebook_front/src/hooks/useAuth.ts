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
            const existingUser = findUserByEmail(email)

            if (!existingUser) {
                return { error: { message: '用戶不存在，請先註冊' } }
            }

            // 簡單的密碼驗證（實際應用中應該使用加密）
            const storedPassword = localStorage.getItem(`password_${existingUser.id}`)
            if (storedPassword !== password) {
                return { error: { message: '密碼錯誤' } }
            }

            setCurrentUser(existingUser)
            setUser(existingUser)
            return { error: null }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { error: { message: '登入失敗' } }
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