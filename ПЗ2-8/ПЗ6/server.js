const express = require('express');
const path = require('path');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [
    { id: 1, title: 'Налаштувати валідацію Joi на сервері', completed: true },
    { id: 2, title: 'Підключити бібліотеку сповіщень Notyf', completed: false }
];
let nextId = 3;

const taskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Назва задачі повинна бути текстовим рядком',
            'string.empty': 'Назва задачі не може бути порожньою',
            'string.min': 'Назва задачі повинна містити щонайменше 3 символи',
            'string.max': 'Назва задачі не може перевищувати 100 символів',
            'any.required': 'Поле title є обов’язковим'
        }),
    completed: Joi.boolean().optional()
});

app.get('/', (req, res) => {
    res.render('tasks', {
        title: 'Список справ (To-Do List)',
        tasks
    });
});

app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { error, value } = taskSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        });
    }

    const newTask = {
        id: nextId++,
        title: value.title,
        completed: false
    };

    tasks.push(newTask);

    return res.status(201).json({
        status: 'success',
        message: 'Задачу успішно створено!',
        task: newTask
    });
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            status: 'error',
            message: 'Задачу з вказаним ID не знайдено'
        });
    }

    if (req.body.title !== undefined) {
        const { error, value } = taskSchema.validate({ title: req.body.title });
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }
        task.title = value.title;
    }

    if (typeof req.body.completed === 'boolean') {
        task.completed = req.body.completed;
    }

    return res.status(200).json({
        status: 'success',
        message: 'Задачу успішно оновлено!',
        task
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'Задачу для видалення не знайдено'
        });
    }

    tasks.splice(taskIndex, 1);

    return res.status(200).json({
        status: 'success',
        message: 'Задачу успішно видалено!'
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
