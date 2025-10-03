// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import type { User } from '../types'
import { signInApi, signUpApi, getMeApi, signOutApi } from '../lib/usersApi'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)


    // 初始化，檢查是否已登入
    useEffect(() => {
        (async () => {
            const res = await getMeApi()
            if (res.success && res.data) {
                setUser(res.data)
            } else {
                setUser(null) // 沒登入，不用顯示錯誤，交給 UI 去導到登入頁
            }
            setLoading(false)
        })()
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
        const res = await signOutApi()
        if (!res.success) return { error: { message: res.message } }

        setUser(null)
        return { error: null }
    }

    return { user, loading, signIn, signUp, signOut }
}
