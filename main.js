//khai báo
const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.getElementById('addTaskModal');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const modalOverlay = document.querySelector('.modal__overlay');
const inputName = document.getElementById('task-name');
const inputPriority = document.getElementById('priority');
const inputDeadline = document.getElementById('deadline');
const isOverdue = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    return dueDate < today;
};
const listItems = [{
    id: 1,
    name: 'Viết báo cáo tổng kết',
    priority: 'Cao',
    deadline: '2026-04-28',
    isCompleted: false,
    tag:"công việc"

}, {
    id: 2,
    name: 'Ôn tập chương 3 & 4',
    priority: 'Trung bình',
    deadline: '2026-05-01',
    isCompleted: false,
    tag:"học tập"
}, {
    id: 3,
    name: 'Đọc sách DOM Enlightenment',
    priority: 'Thấp',
    deadline: '2026-05-05',
    isCompleted: false,
    tag:"cá nhân"
}
    , {
    id: 4,
    name: 'Cài đặt môi trường VS Code',
    priority: 'Thấp',
    deadline: '2026-04-29',
    isCompleted: true,
    tag:"cá nhân"
}

];

    
// MỞ task
addTaskBtn.addEventListener('click', () => {
    modal.classList.add('modal--active');
})
// Đóng modal
function closeModal() {
    modal.classList.remove('modal--active');
    taskForm.reset();
}
cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--active')) {
        closeModal();
    }
});


// render list tasks
function renderTasks() {
    const html = listItems.map((item) => {
        const priorityClass =
            item.priority === 'Cao'
                ? 'high'
                : item.priority === 'Trung bình'
                ? 'medium'
                : 'low';

        return `
            <article class="task-card task-card--${priorityClass} ${item.isCompleted ? 'task-card--done' : ''}">
                <label class="task-card__checkbox">
                    <input class="task-card__input" type="checkbox" data-id="${item.id}" ${item.isCompleted ? 'checked' : ''} />
                    <span class="task-card__checkmark"></span>
                </label>

                <div class="task-card__content">
                    <div class="task-card__header">
                        <h2 class="task-card__title">${item.name}</h2>
                        <span class="task-card__badge task-card__badge--${priorityClass}">
                            ${item.priority}
                        </span>
                    </div>

                    <div class="task-card__meta">
                        <span class="task-card__deadline">
                            Hạn: ${item.deadline}
                        </span>
                        <span class="task-card__tag task-card__tag--${priorityClass}">
                                ${item.tag}
                        </span> 
                    </div>
                </div>
                
                <button class="task-card__menu">•••</button>
            </article>
        `;
    });

    tasklist.innerHTML = html.join('');
}
const tasklist = document.getElementById('taskList');
renderTasks();

// checkbox task
document.getElementById('taskList').addEventListener('change', (e) => {
    if (e.target.classList.contains('task-card__input')) {
        const id = Number(e.target.dataset.id);
        const isChecked = e.target.checked; 
        const task = listItems.find(item => item.id === id);
        if (task) {
            task.isCompleted = isChecked;
        }

        renderTasks();
    }
});

// tag
const tags = document.querySelectorAll('.modal__tag');
tags.forEach(tag => {
    tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('modal__tag--active'));
        tag.classList.add('modal__tag--active');
    });
});

// submit form  
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = inputName.value.trim();
    const priority = inputPriority.value.replace('• ', '');
    const deadline = inputDeadline.value;
    const activeTag = document.querySelector('.modal__tag--active');
    const tag = activeTag ? activeTag.innerText : '';
    const newTask = {
        id: Date.now(),
        name,
        priority,
        deadline,
        isCompleted: false,
        tag
    };

    listItems.push(newTask);
    renderTasks();
    closeModal(); 
});


