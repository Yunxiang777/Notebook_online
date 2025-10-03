import { useState, useEffect, useMemo } from 'react'
import type { Note, BaseResponse } from '../types'
import { apiRequest_NOTES } from '../lib/apiRequest'

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    /** 取得目前使用者的筆記 */
    const fetchNotes = async () => {
        setLoading(true)
        try {
            // 這裡直接用 Note[]，不要用 BaseResponse
            const res = await apiRequest_NOTES<Note[]>('', { method: 'GET' })

            if (res && Array.isArray(res)) {
                // 按 updatedAt 排序
                setNotes(
                    res.sort(
                        (a, b) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime()
                    )
                )
            } else {
                console.error("回傳格式不是陣列:", res)
            }
        } catch (err) {
            console.error('取得筆記錯誤', err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchNotes()
    }, [])

    /** 新增筆記 */
    const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const res = await apiRequest_NOTES<BaseResponse<Note>>('', {
                method: 'POST',
                body: JSON.stringify(noteData)
            })
            if (res.success && res.data) {
                setNotes(prev => [res.data!, ...prev])
                return { data: res.data, error: null }
            } else {
                return { data: null, error: res.message || '新增筆記失敗' }
            }
        } catch {
            return { data: null, error: '網路錯誤' }
        }
    }

    /** 更新筆記 */
    const updateNote = async (id: string, noteData: Partial<Note>) => {
        try {
            const res = await apiRequest_NOTES<BaseResponse<Note>>(`/${id}`, {
                method: 'PUT',
                body: JSON.stringify(noteData)
            })
            if (res.success && res.data) {
                setNotes(prev => prev.map(n => (n.id === id ? res.data! : n)))
                return { data: res.data, error: null }
            } else {
                return { data: null, error: res.message || '更新筆記失敗' }
            }
        } catch {
            return { data: null, error: '網路錯誤' }
        }
    }

    /** 刪除筆記 */
    const deleteNote = async (id: string) => {
        try {
            const res = await apiRequest_NOTES<BaseResponse<null>>(`/${id}`, { method: 'DELETE' })
            if (res.success) {
                setNotes(prev => prev.filter(n => n.id !== id))
                return { error: null }
            } else {
                return { error: res.message || '刪除筆記失敗' }
            }
        } catch {
            return { error: '網路錯誤' }
        }
    }

    /** 搜尋過濾筆記 */
    const filteredNotes = useMemo(() =>
        notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
        [notes, searchTerm])

    return {
        notes: filteredNotes,
        loading,
        searchTerm,
        setSearchTerm,
        createNote,
        updateNote,
        deleteNote,
        refreshNotes: fetchNotes
    }
}
