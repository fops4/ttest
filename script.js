document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const successMessage = document.getElementById('success-message');

    // Définir la date minimale pour l'input date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-deadline').setAttribute('min', today);

    // Charger les tâches du stockage local
    loadTasksFromLocalStorage();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;
        const taskDeadline = document.getElementById('task-deadline').value;

        if (taskDeadline < today) {
            showMessage('La date limite ne peut pas être antérieure à aujourd\'hui', 'error');
            return;
        }

        if (taskName && taskDesc && taskDeadline) {
            addTaskToLocalStorage(taskName, taskDesc, taskDeadline);
        } else {
            showMessage('Veuillez remplir tous les champs', 'error');
        }
    });

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.name, task.desc, task.deadline, task.id);
        });
    }

    function addTaskToLocalStorage(name, desc, deadline) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const id = new Date().getTime(); // Utiliser l'heure actuelle comme ID
        const newTask = { id, name, desc, deadline };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToDOM(name, desc, deadline, id);
        clearForm();
        showMessage('Tâche ajoutée avec succès', 'success');
    }

    function addTaskToDOM(name, desc, deadline, id) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.dataset.id = id;

        taskCard.innerHTML = `
            <div>
                <h3>${name}</h3>
                <p><strong>Description:</strong> ${desc}</p>
                <p><strong>Date limite:</strong> ${deadline}</p>
            </div>
            <button>Supprimer</button>
        `;

        taskCard.querySelector('button').addEventListener('click', () => {
            removeTaskFromLocalStorage(id);
            taskList.removeChild(taskCard);
            showMessage('Tâche supprimée avec succès', 'success');
        });

        taskList.appendChild(taskCard);
    }

    function removeTaskFromLocalStorage(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function clearForm() {
        document.getElementById('task-name').value = '';
        document.getElementById('task-desc').value = '';
        document.getElementById('task-deadline').value = '';
    }

    function showMessage(message, type) {
        successMessage.textContent = message;
        successMessage.className = type;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
});
