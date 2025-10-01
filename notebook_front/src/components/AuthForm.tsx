/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
    onSignIn: (email: string, password: string) => Promise<{ error: any }>
    onSignUp: (email: string, password: string) => Promise<{ error: any }>
    loading?: boolean
}

export default function AuthForm({ onSignIn, onSignUp, loading }: AuthFormProps) {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // 登入 | 註冊
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { error } = isSignUp
                ? await onSignUp(email, password)
                : await onSignIn(email, password)

            if (error) {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            我的記事本
                        </h1>
                        <p className="text-blue-100/70">
                            {isSignUp ? '創建新帳號' : '登入您的帳號'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-blue-100/90 mb-2">
                                電子郵件
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="請輸入您的電子郵件"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-100/90 mb-2">
                                密碼
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                    placeholder="請輸入密碼"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-300 text-sm text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading || loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                    {isSignUp ? '註冊' : '登入'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-blue-100/70">
                            {isSignUp ? '已有帳號？' : '還沒有帳號？'}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-blue-300 hover:text-blue-200 font-medium ml-2 transition-colors"
                            >
                                {isSignUp ? '立即登入' : '立即註冊'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}