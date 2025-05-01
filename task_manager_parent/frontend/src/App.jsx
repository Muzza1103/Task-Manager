import { useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import TaskList from './components/TaskList'

export default function App() {
    const [mode,    setMode]     = useState('login')
    const [token,   setToken]    = useState(null)
    const [username,setUsername] = useState('')

    if (token) {
        return (
            <TaskList token={token} username={username}/>
        )
    }

    if (mode === 'signup') {
        return (
            <SignupForm onSignupSuccessful={(newToken, user) => {
                    setToken(newToken)
                    setUsername(user)
                }}
                onBackToLogin={() => setMode('login')}
            />
        )
    }

    return (
        <LoginForm onLogin={(newToken, user) => {
                setToken(newToken)
                setUsername(user)
            }}
            onSwitchToSignup={() => setMode('signup')}
        />
    )
}