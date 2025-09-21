import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import NoteBoard from './components/NoteBoard';

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Collaborative Task Planner</h1>
        <nav>
          <Link to="/">Tasks</Link> |{' '}
          <Link to="/notes">Whiteboard</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/notes" element={<NoteBoard />} />
        </Routes>
      </main>
    </div>
  );
}