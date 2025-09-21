import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import TaskList from './components/TaskList';
import NoteBoard from './components/NoteBoard';

export default function App() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('ctp-theme-preference');
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('ctp-theme-preference', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <h1>Collaborative Task Planner</h1>
          <p>Plan deliverables, capture ideas, and stay aligned in real time.</p>
        </div>
        <div className="header-actions">
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              Tasks
            </NavLink>
            <NavLink
              to="/notes"
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              Whiteboard
            </NavLink>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4V2m0 20v-2M4.22 4.22L5.64 5.64M18.36 18.36l1.42 1.42M4 12H2m20 0h-2M4.22 19.78L5.64 18.36M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="theme-toggle-label">{isDarkMode ? 'Light' : 'Dark'} mode</span>
          </button>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/notes" element={<NoteBoard />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <small>Built for teammates who plan together.</small>
      </footer>
    </div>
  );
}
