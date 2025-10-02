// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import type { User } from '../types'
import { signInApi, signUpApi } from '../lib/usersApi'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: 之後可以呼叫 getMeApi 自動抓取登入資訊
        setLoading(false)
    }, [])

    // 登入
    const signIn = async (email: string, password: string) => {
        const res = await signInApi(email, password)
        if (!res.success) return { error: { message: res.message } }

        if (res.data) setUser(res.data)
        return { error: null }
    }

    // 註冊
    const signUp = async (email: string, password: string) => {
        const res = await signUpApi(email, password)
        if (!res.success) return { error: { message: res.message } }

        if (res.data) setUser(res.data)
        return { error: null }
    }

    // 登出
    const signOut = async () => {
        // TODO: 可以呼叫後端 /logout API 清 Cookie
        setUser(null)
        return { error: null }
    }

    return { user, loading, signIn, signUp, signOut }
}
