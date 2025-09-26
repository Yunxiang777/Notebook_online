import { LogOut, Plus, Search } from 'lucide-react'
import type { User } from '../types'

interface HeaderProps {
    user: User
    onSignOut: () => void
    onNewNote: () => void
    searchTerm: string
    onSearchChange: (term: string) => void
}

export default function Header({ user, onSignOut, onNewNote, searchTerm, onSearchChange }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">記</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">我的記事本</h1>
                    </div>

                    <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="搜尋記事..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onNewNote}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            新增記事
                        </button>

                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>
                            <button
                                onClick={onSignOut}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="登出"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}