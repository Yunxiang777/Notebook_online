import type { Note, User } from '../types'

const USERS_KEY = 'notepad_users'
const NOTES_KEY = 'notepad_notes'
const CURRENT_USER_KEY = 'notepad_current_user'

// 用戶管理
export const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
}

export const saveUser = (user: User): void => {
    const users = getUsers()
    const existingIndex = users.findIndex(u => u.id === user.id)

    if (existingIndex >= 0) {
        users[existingIndex] = user
    } else {
        users.push(user)
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const findUserByEmail = (email: string): User | null => {
    const users = getUsers()
    return users.find(user => user.email === email) || null
}

export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY)
    return userJson ? JSON.parse(userJson) : null
}

export const setCurrentUser = (user: User | null): void => {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
        localStorage.removeItem(CURRENT_USER_KEY)
    }
}

// 記事管理
export const getNotes = (userId: string): Note[] => {
    const notesJson = localStorage.getItem(`${NOTES_KEY}_${userId}`)
    return notesJson ? JSON.parse(notesJson) : []
}

export const saveNotes = (userId: string, notes: Note[]): void => {
    localStorage.setItem(`${NOTES_KEY}_${userId}`, JSON.stringify(notes))
}

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}