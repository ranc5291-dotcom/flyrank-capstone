import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="12" y="16" width="32" height="26" rx="6" fill="white" fillOpacity="0.9" />
            <circle cx="21" cy="29" r="3.5" fill="#7c3aed" />
            <circle cx="35" cy="29" r="3.5" fill="#7c3aed" />
            <rect x="22" y="37" width="12" height="2.5" rx="1.25" fill="#7c3aed" />
            <rect x="26" y="8" width="4" height="8" rx="2" fill="white" fillOpacity="0.9" />
            <circle cx="28" cy="7" r="3" fill="white" fillOpacity="0.9" />
            <rect x="6" y="24" width="6" height="10" rx="3" fill="white" fillOpacity="0.7" />
            <rect x="44" y="24" width="6" height="10" rx="3" fill="white" fillOpacity="0.7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1">Welcome to AI Prompt Studio</h1>
        <p className="text-sm text-white/80 text-center mb-6">Sign in (demo — no real auth)</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/90 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
          <div>
            <label className="block text-sm text-white/90 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-white text-indigo-600 font-semibold hover:bg-white/90 transition-colors"
          >
            Sign in
          </button>
        </form>

        
  <button
    onClick={() => { login(); navigate('/') }}
    className="mt-3 w-full py-2 rounded-md bg-white/20 text-white text-sm hover:bg-white/30"
  >
    Continue as guest
  </button>
      </div>
    </div>
  )
}