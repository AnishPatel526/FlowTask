const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Create a pool using the connection string from the environment
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/*
 * Routes for tasks
 */

// GET /api/tasks – fetch all tasks
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY due_date, id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks – create a new task
router.post('/', async (req, res) => {
  const { title, description, due_date, priority, completed } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, description, due_date, priority, completed) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, due_date, priority || 0, completed || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id – update a task
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description, due_date, priority, completed } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, due_date=$3, priority=$4, completed=$5 WHERE id=$6 RETURNING *',
      [title, description, due_date, priority, completed, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id – remove a task
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;