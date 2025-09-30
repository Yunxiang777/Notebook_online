import { useState, useEffect } from 'react'
import type { User } from '../types'
import { getCurrentUser, setCurrentUser } from '../lib/storage'
import { signInApi, signUpApi } from '../lib/usersApi'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const currentUser = getCurrentUser()
        setUser(currentUser)
        setLoading(false)
    }, [])

    // 登入
    const signIn = async (email: string, password: string) => {
        const res = await signInApi(email, password);

        if (!res.success) return { error: { message: res.message } };

        // 假設後端用 Cookie 存 JWT，前端不需要拿 token
        // data 也可以存使用者基本資訊，如果後端有回傳
        // setCurrentUser(res.data || null);
        setUser(res.data || null);

        return { error: null };
    };

    // 註冊
    const signUp = async (email: string, password: string) => {
        const res = await signUpApi(email, password)
        if (!res.success) return { error: { message: res.message } }

        setCurrentUser(res.data!)
        setUser(res.data!)
        return { error: null }
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