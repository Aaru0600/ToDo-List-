const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];
let nextId = 1;

// Create a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ message: 'Task is required' });

  const newTodo = {
    id: nextId++,
    task,
    isCompleted: false,
    createdAt: new Date()
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Get all todos
app.get('/todos', (req, res) => res.json(todos));

// Get a single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  const { task, isCompleted } = req.body;
  if (task !== undefined) todo.task = task;
  if (isCompleted !== undefined) todo.isCompleted = isCompleted;

  res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });
  const deleted = todos.splice(index, 1);
  res.json({ message: 'Todo deleted', deleted });
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
