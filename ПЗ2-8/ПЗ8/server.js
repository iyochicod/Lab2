require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Task, Category } = require('./models/Task');
const {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByStatus,
    updateTask,
    markAsCompleted,
    deleteTask,
    getTasksSummary
} = require('./controllers/TaskController');

const app = express();
app.use(express.json());

const DB_URI = process.env.DB_URI;

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/tasks/summary', async (req, res) => {
    try {
        const summary = await getTasksSummary();
        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/tasks/status/:status', async (req, res) => {
    try {
        const tasks = await getTasksByStatus(req.params.status);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await getTaskById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Справу не знайдено' });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const task = await createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await updateTask(req.params.id, req.body);
        if (!task) return res.status(404).json({ message: 'Справу не знайдено' });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.patch('/api/tasks/:id/complete', async (req, res) => {
    try {
        const task = await markAsCompleted(req.params.id);
        if (!task) return res.status(404).json({ message: 'Справу не знайдено' });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await deleteTask(req.params.id);
        if (!task) return res.status(404).json({ message: 'Справу не знайдено' });
        res.status(200).json({ message: 'Справу видалено', task });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

async function runDemo() {
    await Task.deleteMany({});
    await Category.deleteMany({});

    const studyCat = await Category.create({ name: 'Навчання' });
    const workCat = await Category.create({ name: 'Розробка' });

    const t1 = await createTask({
        title: 'Налаштувати MongoDB Atlas',
        description: 'Створити кластер M0 Sandbox та додати IP 0.0.0.0/0',
        priority: 5,
        dueDate: new Date('2026-11-25'),
        category: studyCat._id
    });

    const t2 = await createTask({
        title: 'Реалізувати CRUD-контролер',
        description: 'Написати методи створення, читання, оновлення та видалення',
        priority: 4,
        dueDate: new Date('2026-11-26'),
        category: workCat._id
    });

    const t3 = await createTask({
        title: 'Додати агрегаційний запит',
        description: 'Згрупувати задачі за статусом через $group',
        priority: 3,
        dueDate: new Date('2026-11-27'),
        category: workCat._id
    });

    console.log('\n1. [CREATE] Створено 3 справи. Перша справа:', t1.title);

    const allTasks = await getAllTasks();
    console.log('\n2. [READ - getAllTasks + populate] Усі справи (відсортовані за createdAt):');
    allTasks.forEach(t => console.log(`- ${t.title} | Статус: ${t.status} | Пріоритет: ${t.priority} | Категорія: ${t.category?.name}`));

    const foundById = await getTaskById(t1._id);
    console.log('\n3. [READ - getTaskById]:', foundById.title, '-> ID:', foundById._id);

    const updated = await updateTask(t2._id, { priority: 5, description: 'Оновлений опис контролера' });
    console.log('\n4. [UPDATE - updateTask] Новий пріоритет справи 2:', updated.priority);

    const completed = await markAsCompleted(t1._id);
    console.log('\n5. [UPDATE - markAsCompleted] Справа 1:', completed.title, '-> Статус:', completed.status);

    const completedList = await getTasksByStatus('completed');
    console.log('\n6. [READ - getTasksByStatus("completed")] Знайдено:', completedList.length);

    const summaryBeforeDelete = await getTasksSummary();
    console.log('\n7. [AGGREGATE - getTasksSummary]:', summaryBeforeDelete);

    const deleted = await deleteTask(t3._id);
    console.log('\n8. [DELETE - deleteTask] Видалено справу:', deleted.title);

    const summaryFinal = await getTasksSummary();
    console.log('\n9. [AGGREGATE - підсумкова статистика]:', summaryFinal);
}

mongoose.connect(DB_URI)
    .then(async () => {
        console.log('Підключено до MongoDB Atlas');
        await runDemo();
    })
    .catch((err) => console.error('Помилка підключення:', err));
