const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        priority: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        dueDate: {
            type: Date
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model('Category', categorySchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { Task, Category };
