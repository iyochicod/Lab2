document.addEventListener('DOMContentLoaded', () => {
    const notyf = new Notyf({
        duration: 3500,
        position: { x: 'right', y: 'top' },
        dismissible: true
    });

    const addTaskForm = document.getElementById('addTaskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskList = document.getElementById('taskList');

    function renderTaskItem(task) {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.title;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn-toggle';
        toggleBtn.dataset.id = task.id;
        toggleBtn.dataset.completed = task.completed ? 'true' : 'false';
        toggleBtn.textContent = task.completed ? 'Відновити' : 'Виконано';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.dataset.id = task.id;
        deleteBtn.textContent = 'Видалити';

        actionsDiv.appendChild(toggleBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    }

    addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = taskTitleInput.value;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });

            const data = await response.json();

            if (response.status === 201) {
                notyf.success(data.message);
                renderTaskItem(data.task);
                taskTitleInput.value = '';
            } else if (response.status === 400 || response.status === 404) {
                notyf.error(data.message);
            } else {
                notyf.error(data.message || 'Виникла непередбачена помилка сервера');
            }
        } catch (err) {
            notyf.error('Помилка з’єднання із сервером');
        }
    });

    taskList.addEventListener('click', async (event) => {
        const target = event.target;
        const taskId = target.dataset.id;

        if (!taskId) return;

        if (target.classList.contains('btn-delete')) {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (response.status === 200) {
                    notyf.success(data.message);
                    const item = taskList.querySelector(`li[data-id="${taskId}"]`);
                    if (item) item.remove();
                } else {
                    notyf.error(data.message);
                }
            } catch (err) {
                notyf.error('Не вдалося видалити задачу');
            }
        }

        if (target.classList.contains('btn-toggle')) {
            const currentCompleted = target.dataset.completed === 'true';
            const updatedCompleted = !currentCompleted;

            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed: updatedCompleted })
                });
                const data = await response.json();

                if (response.status === 200) {
                    notyf.success(data.message);
                    const item = taskList.querySelector(`li[data-id="${taskId}"]`);
                    if (item) {
                        item.classList.toggle('completed', updatedCompleted);
                    }
                    target.dataset.completed = updatedCompleted ? 'true' : 'false';
                    target.textContent = updatedCompleted ? 'Відновити' : 'Виконано';
                } else {
                    notyf.error(data.message);
                }
            } catch (err) {
                notyf.error('Не вдалося оновити статус задачі');
            }
        }
    });
});
