//khai báo
const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.getElementById('addTaskModal');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const modalOverlay = document.querySelector('.modal__overlay');
const inputName = document.getElementById('task-name');
const inputPriority = document.getElementById('priority');
const inputDeadline = document.getElementById('deadline');
const filter = {
    active : document.getElementById('filterActive'),
    high : document.getElementById('filterHigh'),
    medium : document.getElementById('filterMedium'),
    low : document.getElementById('filterLow'),
    deadline : document.getElementById('filterDeadline'),
    toggleCompleted : document.getElementById('toggleCompleted')
};
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
    tag: "công việc",
    menuOpen: false

}, {
    id: 2,
    name: 'Ôn tập chương 3 & 4',
    priority: 'Trung bình',
    deadline: '2026-05-01',
    isCompleted: false,
    tag: "học tập",
    menuOpen: false
}, {
    id: 3,
    name: 'Đọc sách DOM Enlightenment',
    priority: 'Thấp',
    deadline: '2026-05-05',
    isCompleted: false,
    tag: "cá nhân",
    menuOpen: false
}
    , {
    id: 4,
    name: 'Cài đặt môi trường VS Code',
    priority: 'Thấp',
    deadline: '2026-04-29',
    isCompleted: true,
    tag: "cá nhân",
    menuOpen: false
}

];

//filter
let currentPriorityFilter = 'all';
function getFilteredTasks() {
    if (currentPriorityFilter === 'all') {
        return listItems;
    }

    return listItems.filter(item => item.priority === currentPriorityFilter);
}
function setActiveFilterButton(activeButton) {
    document.querySelectorAll('.task-manager__filter').forEach(btn => {
        btn.classList.remove('task-manager__filter--active');
    });

    activeButton.classList.add('task-manager__filter--active');
}


// MỞ task
addTaskBtn.addEventListener('click', () => {
    modal.classList.add('modal--active');
})
// Đóng modal
function closeModal() {
    modal.classList.remove('modal--active');
    taskForm.reset();
    delete taskForm.dataset.editId;
    document.querySelectorAll('.modal__tag').forEach(tag => {
        tag.classList.remove('modal__tag--active');
    });
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
    const tasksToRender = getFilteredTasks();

    const html = tasksToRender.map((item) => {
        const priorityClass =
            item.priority === 'Cao'
                ? 'high'
                : item.priority === 'Trung bình'
                    ? 'medium'
                    : 'low';

        return `
            <article class="task-card task-card--${priorityClass} ${item.isCompleted ? 'task-card--done' : ''}" data-task-id="${item.id}">
                <label class="task-card__checkbox" for="checkbox-${item.id}">
                    <input class="task-card__input" id="checkbox-${item.id}" type="checkbox" data-id="${item.id}" ${item.isCompleted ? 'checked' : ''} />
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
                
                <div class="task-card__menu-wrap">
                    <button class="task-card__menu" data-action="toggle-menu" data-id="${item.id}">...</button>
                    <div class="task-card__dropdown ${item.menuOpen ? 'task-card__dropdown--open' : ''}" data-dropdown-id="${item.id}">
                        <button class="task-card__dropdown-item" data-action="edit" data-id="${item.id}">Sửa</button>
                        <button class="task-card__dropdown-item task-card__dropdown-item--danger" data-action="delete" data-id="${item.id}">Xóa</button>
                    </div>
                </div>
            </article>
        `;
    });

    tasklist.innerHTML = html.join('');
}
const tasklist = document.getElementById('taskList');
renderTasks();

filter.active.addEventListener('click', () => {
    currentPriorityFilter = 'all';
    setActiveFilterButton(filter.active);
    renderTasks();
});

filter.high.addEventListener('click', () => {
    currentPriorityFilter = 'Cao';
    setActiveFilterButton(filter.high);
    renderTasks();
});

filter.medium.addEventListener('click', () => {
    currentPriorityFilter = 'Trung bình';
    setActiveFilterButton(filter.medium);
    renderTasks();
});

filter.low.addEventListener('click', () => {
    currentPriorityFilter = 'Thấp';
    setActiveFilterButton(filter.low);
    renderTasks();
});



document.getElementById('taskList').addEventListener('change', (e) => {
    if (e.target.classList.contains('task-card__input')) {
        const id = Number(e.target.dataset.id);
        const isChecked = e.target.checked;
        const task = listItems.find(item => item.id === id);
        if (task) {
            task.isCompleted = isChecked;
        }

        const taskCard = e.target.closest('.task-card');
        if (taskCard) {
            taskCard.classList.toggle('task-card--done', isChecked);
        }
        renderTasks();
    }
});

function closeAllMenus() {
    listItems.forEach(item => {
        item.menuOpen = false;
    });
}




tasklist.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const id = Number(actionBtn.dataset.id);
    const action = actionBtn.dataset.action;
    const taskIndex = listItems.findIndex(item => item.id === id);

    if (taskIndex === -1) return;

    if (action === 'toggle-menu') {
        const task = listItems[taskIndex];
        const isOpen = !!task.menuOpen;
        closeAllMenus();
        task.menuOpen = !isOpen;
        renderTasks();
        return;
    }

    closeAllMenus();

    if (action === 'delete') {
        listItems.splice(taskIndex, 1);
        // listItems = listItems.filter(item => item.id !== id);
        renderTasks();
        return;
    }

    if (action === 'edit') {
        const task = listItems[taskIndex];
        inputName.value = task.name;
        inputPriority.value = `• ${task.priority}`;
        inputDeadline.value = task.deadline;

        const tagButtons = document.querySelectorAll('.modal__tag');
        tagButtons.forEach(btn => {
            btn.classList.remove('modal__tag--active');
            if (btn.innerText.trim() === task.tag) {
                btn.classList.add('modal__tag--active');
            }
        });

        modal.classList.add('modal--active');
        taskForm.dataset.editId = task.id;
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.task-card__menu-wrap')) {
        closeAllMenus();
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
    const editId = taskForm.dataset.editId ? Number(taskForm.dataset.editId) : null;

    if (editId) {
        const task = listItems.find(item => item.id === editId);
        if (task) {
            task.name = name;
            task.priority = priority;
            task.deadline = deadline;
            task.tag = tag;
        }
    } else {
        const newTask = {
            id: Date.now(),
            name,
            priority,
            deadline,
            isCompleted: false,
            tag,
            menuOpen: false
        };

        listItems.push(newTask);
    }

    renderTasks();
    closeModal();
});

const clearCompletedBtn = document.querySelector('.task-manager__action--delete');
clearCompletedBtn.addEventListener('click', () => {
    for (let i = listItems.length - 1; i >= 0; i -= 1) {
        if (listItems[i].isCompleted) {
            listItems.splice(i, 1);
        }
    }
    // listItems = listItems.filter(item => !item.isCompleted);

    renderTasks();
});

