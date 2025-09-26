import React from 'react'
import type { Note } from '../types'
import NoteCard from './NoteCard'
import { FileText } from 'lucide-react'

interface NotesGridProps {
    notes: Note[]
    onEditNote: (note: Note) => void
    onDeleteNote: (id: string) => void
    loading?: boolean
}

export default function NotesGrid({ notes, onEditNote, onDeleteNote, loading }: NotesGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="space-y-2 mb-4">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (notes.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    還沒有記事
                </h3>
                <p className="text-gray-500 mb-8">
                    開始創建您的第一篇記事吧！
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEditNote}
                    onDelete={onDeleteNote}
                />
            ))}
        </div>
    )
}