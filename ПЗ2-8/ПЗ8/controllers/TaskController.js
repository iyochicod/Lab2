const { Task } = require('../models/Task');

async function createTask(data) {
    const task = new Task(data);
    return await task.save();
}

async function getAllTasks() {
    return await Task.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 });
}

async function getTaskById(id) {
    return await Task.findById(id).populate('category', 'name');
}

async function getTasksByStatus(status) {
    return await Task.find({ status })
        .populate('category', 'name')
        .sort({ createdAt: -1 });
}

async function updateTask(id, updateData) {
    return await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate('category', 'name');
}

async function markAsCompleted(id) {
    return await Task.findByIdAndUpdate(
        id,
        { status: 'completed' },
        { new: true, runValidators: true }
    ).populate('category', 'name');
}

async function deleteTask(id) {
    return await Task.findByIdAndDelete(id);
}

async function getTasksSummary() {
    const stats = await Task.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const summary = {
        pending: 0,
        completed: 0,
        total: 0
    };

    stats.forEach((item) => {
        if (item._id === 'pending') {
            summary.pending = item.count;
        } else if (item._id === 'completed') {
            summary.completed = item.count;
        }
        summary.total += item.count;
    });

    return summary;
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByStatus,
    updateTask,
    markAsCompleted,
    deleteTask,
    getTasksSummary
};
