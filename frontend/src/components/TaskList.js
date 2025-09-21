import React, { useState, useEffect } from 'react';
import api from '../services/api';
import socket from '../services/socket';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks();
    // Listen for real‑time updates
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });
    return () => {
      socket.off('taskUpdated');
    };
  }, []);

  const loadTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await api.createTask(newTask);
    setTasks([...tasks, created]);
    setNewTask({ title: '', description: '', due_date: '' });
    // Notify other clients
    socket.emit('taskUpdated', created);
  };

  const toggleCompletion = async (task) => {
    const updated = await api.updateTask(task.id, {
      ...task,
      completed: !task.completed
    });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    socket.emit('taskUpdated', updated);
  };

  return (
    <div className="task-list-container">
      <h2>Tasks</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={newTask.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="due_date"
          value={newTask.due_date}
          onChange={handleChange}
        />
        <button type="submit">Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task)}
            />
            <span className="task-title">{task.title}</span>
            {task.due_date && (
              <small className="task-date">
                (Due: {new Date(task.due_date).toLocaleString()})
              </small>
            )}
            <p className="task-desc">{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}