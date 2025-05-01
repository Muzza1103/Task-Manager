import { useState } from 'react'
import axios from 'axios'

export default function SignupForm({ onSignupSuccessful, onBackToLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState(null)
    const [loading, setLoading]   = useState(false)


    const handleSubmit = async e => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await axios.post('/api/users', { username, password })
            const loginRes = await axios.post('/api/auth/login', { username, password })
            const token = loginRes.data.token
            onSignupSuccessful(token, username)
        } catch (e) {
            setError(e.response?.data?.error || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="signup-form-container">
            <h1>Task Manager</h1>
            <h2>Create an account</h2>
            {error && <p className="mb-3 text-red-400">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
                    disabled={loading}
                >
                    {loading ? 'Signing up…' : 'Sign up'}
                </button>
            </form>
            <button
                onClick={onBackToLogin}
                className="mt-4 text-center w-full text-blue-400 hover:underline"
                disabled={loading}
            >
                ← Back to login
            </button>
        </div>
    )
}