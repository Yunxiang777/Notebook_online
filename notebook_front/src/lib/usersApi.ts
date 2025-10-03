// lib/usersApi.ts
import type { LoginResponse, RegisterResponse, GetMeResponse } from '../types'
import { apiRequest_USERS } from './apiRequest'

// 註冊
export const signUpApi = (email: string, password: string) =>
    apiRequest_USERS<RegisterResponse>('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })

// 登入
export const signInApi = (email: string, password: string) =>
    apiRequest_USERS<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })

// 取得目前使用者
export const getMeApi = () =>
    apiRequest_USERS<GetMeResponse>('/me', { method: 'GET' })
