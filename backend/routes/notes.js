const express = require('express');
const router = express.Router();

/*
 * Routes for collaborative notes/whiteboard.
 *
 * In this simple implementation the whiteboard is not persisted to the database; it relies on
 * WebSocket events to broadcast strokes between clients. You could extend this router to
 * persist note snapshots or maintain version history if needed.
 */

// GET /api/notes – placeholder endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Notes API placeholder' });
});

module.exports = router;