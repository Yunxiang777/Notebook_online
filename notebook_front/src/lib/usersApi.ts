// lib/usersApi.ts
import type { LoginResponse, RegisterResponse } from '../types'
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
