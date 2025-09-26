import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useNotes } from './hooks/useNotes'
import AuthForm from './components/AuthForm'
import Header from './components/Header'
import NotesGrid from './components/NotesGrid'
import NoteEditor from './components/NoteEditor'
import LoadingSpinner from './components/LoadingSpinner'
import type { Note } from './types'

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { notes, loading: notesLoading, searchTerm, setSearchTerm, createNote, updateNote, deleteNote } = useNotes()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | undefined>()

  const handleNewNote = () => {
    setEditingNote(undefined)
    setIsEditorOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  const handleSaveNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    if (editingNote) {
      await updateNote(editingNote.id, noteData)
    } else {
      await createNote(noteData)
    }
    setIsEditorOpen(false)
    setEditingNote(undefined)
  }

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('確定要刪除這篇記事嗎？')) {
      await deleteNote(id)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} loading={authLoading} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onSignOut={handleSignOut}
        onNewNote={handleNewNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotesGrid
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          loading={notesLoading}
        />
      </main>

      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => {
            setIsEditorOpen(false)
            setEditingNote(undefined)
          }}
        />
      )}
    </div>
  )
}

export default App