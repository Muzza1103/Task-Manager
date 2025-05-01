import { useState } from 'react'
import axios from 'axios'

export default function LoginForm({ onLogin, onSwitchToSignup }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState(null)


    const handleSubmit = async e => {
        e.preventDefault()
        setError(null)
        try {
            const res = await axios.post('/api/auth/login', { username, password })
            const token = res.data.token
            onLogin(token, username)
        } catch (e) {
            setError(e.response?.data?.error || 'Login failed')
        }
    }

    return (
        <div className="login-form-container">
            <h1>Task Manager</h1>
            <h2>Log In</h2>

            {error && (
                <p className="text-red-400 text-sm mb-4">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 mb-1" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                >
                    Log In
                </button>
            </form>
            <div className="mt-4 text-center text-gray-400">
                Don’t have an account?{' '}
                <button
                    onClick={onSwitchToSignup}
                    className="text-blue-400 hover:underline"
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}