import { useState, useEffect } from 'react'
import type { User } from '../types'
import { signInApi, signUpApi } from '../lib/usersApi'

// TODO: 未來可以新增 getMeApi 從後端拿使用者資訊
export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 這裡可以加個 "getMe" API，自動讀 Cookie 拿使用者
        setLoading(false)
    }, [])

    // 登入
    const signIn = async (email: string, password: string) => {
        const res = await signInApi(email, password)

        if (!res.success) {
            return { error: { message: res.message } }
        }

        if (res.data) {
            setUser(res.data)
        }

        return { error: null }
    }


    // 註冊
    const signUp = async (email: string, password: string) => {
        const res = await signUpApi(email, password)

        if (!res.success) return { error: { message: res.message } }

        setUser(res.data || null)
        return { error: null }
    }

    const signOut = async () => {
        // TODO: 可以呼叫後端 /logout API 把 Cookie 清掉
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
