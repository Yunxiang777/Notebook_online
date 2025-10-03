export interface Note {
    id: string
    title: string
    content: string
    tags: string[]
    createdAt: string
    updatedAt: string
}

export interface User {
    id: string
    email: string
}

// BaseResponse
export interface BaseResponse<T> {
    success: boolean
    message?: string
    data?: T
}

// 泛型派生
export type LoginResponse = BaseResponse<User>
export type RegisterResponse = BaseResponse<User>
export type GetMeResponse = BaseResponse<User>
export type LogoutResponse = BaseResponse<null>