// routes/todo.js
const express = require('express');
const ToDo = require('../models/ToDo'); // Import the ToDo model correctly

const router = express.Router();

// Create a new to-do item
router.post('/todos', async (req, res) => {
  try {
    const { taskName } = req.body;
    if (!taskName) {
      return res.status(400).json({ error: 'Task name is required' });
    }
    const todo = await ToDo.create({ taskName });
    res.status(201).json({ message: 'ToDo item created successfully', todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all to-do items
router.get('/todos', async (req, res) => {
  try {
    const todos = await ToDo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single to-do item by ID
router.get('/todos/:id', async (req, res) => {
  try {
    const todo = await ToDo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'ToDo item not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a to-do item
router.put('/todos/:id', async (req, res) => {
  try {
    const { taskName, completed } = req.body;
    const todo = await ToDo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'ToDo item not found' });
    }

    todo.taskName = taskName || todo.taskName;
    todo.completed = completed !== undefined ? completed : todo.completed;
    
    await todo.save();
    res.status(200).json({ message: 'ToDo item updated successfully', todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a to-do item
router.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await ToDo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'ToDo item not found' });
    }

    await todo.destroy();
    res.status(200).json({ message: 'ToDo item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
