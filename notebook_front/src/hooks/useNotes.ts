import { useState, useEffect } from 'react'
import type { Note } from '../types'
import { getNotes, saveNotes, generateId, getCurrentUser } from '../lib/storage'

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchNotes = () => {
        const currentUser = getCurrentUser()
        if (currentUser) {
            const userNotes = getNotes(currentUser.id)
            setNotes(userNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchNotes()
    }, [])

    const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const currentUser = getCurrentUser()
        if (!currentUser) return { error: 'User not authenticated' }

        const newNote: Note = {
            ...noteData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const updatedNotes = [newNote, ...notes]
        setNotes(updatedNotes)
        saveNotes(currentUser.id, updatedNotes)

        return { data: newNote, error: null }
    }

    const updateNote = async (id: string, noteData: Partial<Note>) => {
        const currentUser = getCurrentUser()
        if (!currentUser) return { error: 'User not authenticated' }

        const updatedNotes = notes.map(note =>
            note.id === id
                ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
                : note
        )

        setNotes(updatedNotes)
        saveNotes(currentUser.id, updatedNotes)

        const updatedNote = updatedNotes.find(note => note.id === id)
        return { data: updatedNote, error: null }
    }

    const deleteNote = async (id: string) => {
        const currentUser = getCurrentUser()
        if (!currentUser) return { error: 'User not authenticated' }

        const updatedNotes = notes.filter(note => note.id !== id)
        setNotes(updatedNotes)
        saveNotes(currentUser.id, updatedNotes)

        return { error: null }
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return {
        notes: filteredNotes,
        loading,
        searchTerm,
        setSearchTerm,
        createNote,
        updateNote,
        deleteNote,
        refreshNotes: fetchNotes,
    }
}