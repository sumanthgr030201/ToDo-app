import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [task, setTask] = useState('')
  const [description, setDescription] = useState('')
  const [todos, setTodos] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = () => {
    axios.get('http://localhost:9001/todos')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    // Check if task or description is empty
    if (!task.trim() || !description.trim()) {
      alert('Task and description cannot be empty')
      return
    }

    const newTask = { task, description, completed: false }
    if (editingId) {
      axios.put(`http://localhost:9001/todos/${editingId}`, { ...newTask, completed: todos.find(todo => todo._id === editingId).completed })
        .then(result => {
          setTodos(todos.map(todo => (todo._id === editingId ? result.data : todo)))
          setEditingId(null)
        })
        .catch(err => console.log(err))
    } else {
      axios.post('http://localhost:9001/todos', newTask)
        .then(result => setTodos([...todos, result.data]))
        .catch(err => console.log(err))
    }
    setTask('')
    setDescription('')
  }

  const handleEdit = (id) => {
    const todo = todos.find(todo => todo._id === id)
    setTask(todo.task)
    setDescription(todo.description)
    setEditingId(id)
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:9001/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(err => console.log(err))
  }

  const handleToggleComplete = (id, completed) => {
    axios.put(`http://localhost:9001/todos/${id}`, { completed: !completed })
      .then(result => {
        setTodos(todos.map(todo => (todo._id === id ? result.data : todo)))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="container">
      <h1>TODO LIST</h1>
      <form onSubmit={handleAdd}>
        <input 
          type='text' 
          placeholder='Enter task' 
          onChange={e => setTask(e.target.value)} 
          value={task}
        />
        <input 
          type='text' 
          placeholder='Description' 
          onChange={e => setDescription(e.target.value)} 
          value={description}
        />
        <button type='submit'>{editingId ? 'Update Item' : 'Add Item'}</button>
      </form>
      {
        todos.length === 0 ?
        <p>No Records</p> :
        <ul>
          {todos.map((todo) => (
            <li key={todo._id} className={todo.completed ? 'completed' : ''}>
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo._id, todo.completed)}
                />
                <b>{todo.task} </b> - {todo.description}
              </div>
              <button className="edit" onClick={() => handleEdit(todo._id)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default App
