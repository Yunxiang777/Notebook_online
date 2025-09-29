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
        const res = await signInApi(email, password)
        if (!res.success) return { error: { message: res.message } }

        setCurrentUser(res.data!)
        setUser(res.data!)
        return { error: null }
    }

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