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
    createdAt: string
}

export interface LoginResponse {
    success: boolean
    message?: string
    data?: User
}