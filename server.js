// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const prepareModels = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/reactcrudapp');

    // Schemas
    const todoSchema = new mongoose.Schema({
        title: String,
        description: String,
    });

    return {
        Todo: mongoose.model('Todo', todoSchema)
    };
}

prepareModels().then(function(models) {
    const { Todo } = models;

    app.get('/todos', async (req, res) => {
        const todos = await Todo.find();
        res.json(todos);
    });
    
    app.post('/todos', async (req, res) => {
        const { title, description } = req.body;
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.json(newTodo);
    });
    
    app.put('/todos/:id', async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { title, description }, { new: true });
        res.json(updatedTodo);
    });
    
    app.delete('/todos/:id', async (req, res) => {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted successfully' });
    });
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})