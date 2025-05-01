import { useState, useEffect } from 'react'
import axios from 'axios'

export default function TaskList({ token, username }) {
    const [tasks, setTasks]     = useState([])
    const [title, setTitle]     = useState('')
    const [desc, setDesc]       = useState('')
    const [dueDate, setDueDate] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTasks(res.data)
        } catch (err) {
            console.error(err)
            alert("Unable to load tasks")
        } finally {
            setLoading(false)
        }
    }

    const addTask = async () => {
        if (!title.trim() || title.length > 100) return
        if (desc.length > 500) return

        try {
            await axios.post(
                '/api/tasks',
                { title: title.trim(), description: desc.trim(), dueDate: dueDate || null },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setTitle('')
            setDesc('')
            setDueDate('')
            fetchTasks()
        } catch (err) {
            console.error(err)
            alert("Unable to add task")
        }
    }

    const toggleDone = async (task) => {
        try {
            await axios.put(
                `/api/tasks/toggle/${task.id}`,
                { done: !task.done },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTasks()
        } catch (err) {
            console.error(err)
            alert("Unable to update status")
        }
    }

    const deleteTask = async (id) => {
        if (!confirm('Delete this task?')) return
        try {
            await axios.delete(
                `/api/tasks/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTasks()
        } catch (err) {
            console.error(err)
            alert("Unable to delete task")
        }
    }

    const saveEdit = async (id, newTitle, newDesc, newDue) => {
        if (!newTitle.trim() || newTitle.length > 100) return
        if (newDesc.length > 500) return
        try {
            await axios.put(
                `/api/tasks/${id}`,
                { title: newTitle.trim(), description: newDesc.trim(), dueDate: newDue || null },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTasks()
        } catch (err) {
            console.error(err)
            alert("Unable to save changes")
        }
    }

    const deleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account?')) return
        try {
            // first delete all tasks
            await axios.delete('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
            setTasks([])
        } catch (_) { /* ignore */ }

        try {
            await axios.delete(
                '/api/users',
                { headers: { Authorization: `Bearer ${token}` } }
            )
            window.location.reload()
        } catch (err) {
            console.error(err)
            alert("Unable to delete account")
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <header className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Hello, {username}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                    Logout
                </button>
            </header>

            {/* Creation form */}
            <div className="new-task-form max-w-lg mx-auto bg-gray-800 p-4 rounded-lg shadow flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <input
                    type="text"
                    placeholder="Title (max 100 characters)"
                    value={title}
                    maxLength={100}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    rows={2}
                    placeholder="Description (max 500 characters)"
                    value={desc}
                    maxLength={500}
                    onChange={e => setDesc(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 text-xs"
                />
                <button
                    onClick={addTask}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                >
                    Add
                </button>
            </div>

            {/* Task list */}
            {loading ? (
                <p className="text-gray-400">Loading…</p>
            ) : (
                <ul className="space-y-4">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            toggleDone={toggleDone}
                            deleteTask={deleteTask}
                            saveEdit={saveEdit}
                        />
                    ))}
                </ul>
            )}

            {/* Delete account */}
            <div className="text-center mt-8">
                <button
                    onClick={deleteAccount}
                    className="px-6 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white"
                >
                    Delete my account
                </button>
            </div>
        </div>
    )
}

function TaskCard({ task, toggleDone, deleteTask, saveEdit }) {
    const [ed, setEd] = useState(false)
    const [t, setT] = useState(task.title)
    const [d, setD] = useState(task.description || '')
    const [due, setDue] = useState(task.dueDate || '')

    return (
        <li className="task-card">
            {ed ? (
                // EDIT MODE
                <div className="space-y-2 w-full">
                    <input
                        type="text"
                        value={t}
                        maxLength={100}
                        onChange={e => setT(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-gray-800 text-white"
                    />
                    <textarea
                        rows={2}
                        value={d}
                        maxLength={500}
                        onChange={e => setD(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-gray-800 text-white"
                    />
                    <input
                        type="date"
                        value={due}
                        onChange={e => setDue(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-gray-800 text-white"
                    />
                    <div className="flex space-x-2 mt-2">
                        <button
                            onClick={() => { saveEdit(task.id, t, d, due); setEd(false) }}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEd(false)}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // VIEW MODE
                <div className="flex justify-between items-start w-full">
                    <div>
                        <h3 className={task.done ? 'line-through text-gray-400' : 'text-white font-semibold'}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className={task.done ? 'line-through text-gray-400' : 'text-gray-200'}>
                                {task.description}
                            </p>
                        )}
                        <small className="text-gray-500 block mt-1">
                            Due: {task.dueDate || '—'}
                        </small>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => toggleDone(task)}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
                        >
                            {task.done ? '↺' : '✔️'}
                        </button>
                        <button
                            onClick={() => setEd(true)}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            )}
        </li>
    )
}