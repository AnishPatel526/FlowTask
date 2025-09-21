import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import socket from '../services/socket';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks();
    // Listen for real-time updates
    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) => {
        const exists = prev.some((task) => task.id === updatedTask.id);
        if (exists) {
          return prev.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        }
        return [...prev, updatedTask];
      });
    };

    socket.on('taskUpdated', handleTaskUpdated);
    return () => {
      socket.off('taskUpdated', handleTaskUpdated);
    };
  }, []);

  const loadTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const created = await api.createTask(newTask);
    setTasks((prev) => [...prev, created]);
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

  const totals = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const active = total - completed;
    const overdue = tasks.filter((task) => {
      if (!task.due_date || task.completed) return false;
      const due = new Date(task.due_date).getTime();
      if (Number.isNaN(due)) return false;
      return due < Date.now();
    }).length;

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, overdue, progress };
  }, [tasks]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);

      if (!matchesFilter) return false;

      if (!normalizedSearch) return true;

      const haystack = `${task.title} ${task.description || ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [tasks, filter, normalizedSearch]);

  const sortedTasks = useMemo(() => {
    const now = Date.now();
    return [...filteredTasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      const aHasDue = Boolean(a.due_date);
      const bHasDue = Boolean(b.due_date);
      if (aHasDue && bHasDue) {
        const aTime = new Date(a.due_date).getTime();
        const bTime = new Date(b.due_date).getTime();
        const safeATime = Number.isNaN(aTime) ? now : aTime;
        const safeBTime = Number.isNaN(bTime) ? now : bTime;
        return safeATime - safeBTime;
      }
      if (aHasDue) return -1;
      if (bHasDue) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [filteredTasks]);

  const upcomingTask = useMemo(() => {
    const nextTasks = tasks
      .filter((task) => !task.completed && task.due_date)
      .map((task) => ({
        task,
        due: new Date(task.due_date).getTime()
      }))
      .filter(({ due }) => !Number.isNaN(due))
      .sort((a, b) => a.due - b.due);

    return nextTasks.length > 0 ? nextTasks[0].task : null;
  }, [tasks]);

  const describeDue = (dueValue) => {
    if (!dueValue) return { label: 'No due date', tone: 'neutral' };
    const due = new Date(dueValue);
    if (Number.isNaN(due.getTime())) return { label: 'No due date', tone: 'neutral' };

    const diffMs = due.getTime() - Date.now();
    const abs = Math.abs(diffMs);
    const minutes = Math.max(1, Math.floor(abs / (1000 * 60)));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainderHours = hours % 24;
    const remainderMinutes = minutes % 60;

    const buildLabel = () => {
      if (days > 0) {
        const dayPart = `${days}d`;
        const hourPart = remainderHours > 0 ? ` ${remainderHours}h` : '';
        return `${dayPart}${hourPart}`;
      }
      if (hours > 0) {
        const hourPart = `${hours}h`;
        const minutePart = remainderMinutes > 0 ? ` ${remainderMinutes}m` : '';
        return `${hourPart}${minutePart}`;
      }
      return `${minutes}m`;
    };

    if (diffMs < 0) {
      return { label: `Overdue by ${buildLabel()}`, tone: 'danger' };
    }

    if (abs <= 60 * 60 * 1000) {
      return { label: 'Due within 1h', tone: 'upcoming' };
    }

    return { label: `Due in ${buildLabel()}`, tone: 'upcoming' };
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const renderEmptyState = () => {
    if (tasks.length === 0) {
      return (
        <div className="task-empty">
          <h3>No tasks yet</h3>
          <p>Add your first task to start tracking deliverables.</p>
        </div>
      );
    }

    return (
      <div className="task-empty">
        <h3>No tasks match your current view</h3>
        <p>Adjust the filters or search keywords to see more tasks.</p>
      </div>
    );
  };

  return (
    <section className="task-page">
      <div className="view-heading">
        <h2>Task dashboard</h2>
        <p>Keep your team aligned with focused priorities and clear due dates.</p>
      </div>

      <div className="task-layout">
        <div className="task-main">
          <div className="surface-card task-form-card">
            <div className="card-heading">
              <h3>Create a task</h3>
              <p>Break work into bite-sized pieces your teammates can track.</p>
            </div>
            <form onSubmit={handleSubmit} className="task-form">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="What needs to get done? (optional)"
                value={newTask.description}
                onChange={handleChange}
              />
              <input
                type="datetime-local"
                name="due_date"
                value={newTask.due_date}
                onChange={handleChange}
              />
              <button type="submit">Add task</button>
            </form>
          </div>

          <div className="surface-card task-list-card">
            <div className="task-toolkit">
              <div className="filter-group">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`filter-chip${filter === option.value ? ' is-active' : ''}`}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="search-field">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search tasks"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {sortedTasks.length === 0 ? (
              renderEmptyState()
            ) : (
              <ul className="task-items">
                {sortedTasks.map((task) => {
                  const dueInfo = describeDue(task.due_date);
                  const isOverdue = !task.completed && dueInfo.tone === 'danger';
                  const itemClasses = [
                    'task-item',
                    task.completed ? 'is-complete' : null,
                    isOverdue ? 'is-overdue' : null
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const badgeClass = task.completed
                    ? 'badge-complete'
                    : dueInfo.tone === 'danger'
                    ? 'badge-danger'
                    : dueInfo.tone === 'upcoming'
                    ? 'badge-upcoming'
                    : 'badge-neutral';

                  return (
                    <li key={task.id} className={itemClasses}>
                      <div className="task-item-top">
                        <div className="task-item-main">
                          <label className="task-checkbox">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleCompletion(task)}
                              aria-label={
                                task.completed
                                  ? 'Mark task as incomplete'
                                  : 'Mark task as complete'
                              }
                            />
                            <span className="checkbox-decor" />
                          </label>
                          <div>
                            <p className="task-title">{task.title}</p>
                            {task.description && (
                              <p className="task-desc">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <span className={`badge ${badgeClass}`}>
                          {task.completed ? 'Completed' : dueInfo.label}
                        </span>
                      </div>
                      <div className="task-item-meta">
                        <span className="task-meta-label">Due</span>
                        <span className="task-meta-value">
                          {task.due_date
                            ? new Date(task.due_date).toLocaleString()
                            : 'No target date'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <aside className="task-sidebar">
          <div className="surface-card task-overview">
            <header className="task-overview-header">
              <span className="muted">Completion</span>
              <span className="task-progress-value">{totals.progress}%</span>
            </header>
            <div className="progress-track">
              <div className="progress-indicator" style={{ width: `${totals.progress}%` }} />
            </div>
            <div className="task-stats-grid">
              <div className="stat-block">
                <span className="stat-label">Total</span>
                <span className="stat-value">{totals.total}</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">Active</span>
                <span className="stat-value">{totals.active}</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">Completed</span>
                <span className="stat-value success">{totals.completed}</span>
              </div>
              <div className="stat-block">
                <span className="stat-label">Overdue</span>
                <span className={`stat-value${totals.overdue > 0 ? ' danger' : ''}`}>
                  {totals.overdue}
                </span>
              </div>
            </div>
          </div>

          <div className="surface-card next-task-card">
            <span className="muted">Next up</span>
            {upcomingTask ? (
              <>
                <h3>{upcomingTask.title}</h3>
                {upcomingTask.description && (
                  <p className="next-task-desc">{upcomingTask.description}</p>
                )}
                <div className="next-task-meta">
                  <span className="task-meta-label">Due</span>
                  <span className="task-meta-value">
                    {new Date(upcomingTask.due_date).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <p className="next-task-empty">
                No upcoming due dates. Add one to keep goals on the radar.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
