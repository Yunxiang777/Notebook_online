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

export interface LoginResponse {
    success: boolean
    message?: string
    data?: User
}

export interface RegisterResponse {
    success: boolean
    message?: string
    data?: User
}