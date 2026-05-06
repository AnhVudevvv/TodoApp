//khai báo
const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.getElementById('addTaskModal');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const modalOverlay = document.querySelector('.modal__overlay');
const inputName = document.getElementById('task-name');
const inputPriority = document.getElementById('priority');
const inputDeadline = document.getElementById('deadline');
const tasklist = document.getElementById('taskList');

const filter = {
    active: document.getElementById('filterActive'),
    high: document.getElementById('filterHigh'),
    medium: document.getElementById('filterMedium'),
    low: document.getElementById('filterLow'),
    deadline: document.getElementById('filterDeadline'),
    toggleCompleted: document.getElementById('toggleCompleted')
};

const isOverdue = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    return dueDate < today;
};

// CODE CŨ DÙNG ARRAY
// const listItems = [{
//     id: 1,
//     name: 'Viết báo cáo tổng kết',
//     priority: 'Cao',
//     deadline: '2026-04-28',
//     isCompleted: false,
//     tag: "công việc",
//     menuOpen: false
// }, {
//     id: 2,
//     name: 'Ôn tập chương 3 & 4',
//     priority: 'Trung bình',
//     deadline: '2026-05-01',
//     isCompleted: false,
//     tag: "học tập",
//     menuOpen: false
// }, {
//     id: 3,
//     name: 'Đọc sách DOM Enlightenment',
//     priority: 'Thấp',
//     deadline: '2026-05-05',
//     isCompleted: false,
//     tag: "cá nhân",
//     menuOpen: false
// }, {
//     id: 4,
//     name: 'Cài đặt môi trường VS Code',
//     priority: 'Thấp',
//     deadline: '2026-04-29',
//     isCompleted: true,
//     tag: "cá nhân",
//     menuOpen: false
// }];

// CODE MỚI DÙNG MAP
const myMapItems = new Map([
    [
        1,
        {
            id: 1,
            name: 'Viết báo cáo tổng kết',
            priority: 'Cao',
            deadline: '2026-04-28',
            isCompleted: false,
            tag: 'công việc',
            menuOpen: false,
        },
    ],
    [
        2,
        {
            id: 2,
            name: 'Ôn tập chương 3 & 4',
            priority: 'Trung bình',
            deadline: '2026-05-01',
            isCompleted: false,
            tag: 'học tập',
            menuOpen: false,
        },
    ],
    [
        3,
        {
            id: 3,
            name: 'Đọc sách DOM Enlightenment',
            priority: 'Thấp',
            deadline: '2026-05-05',
            isCompleted: false,
            tag: 'cá nhân',
            menuOpen: false,
        },
    ],
    [
        4,
        {
            id: 4,
            name: 'Cài đặt môi trường VS Code',
            priority: 'Thấp',
            deadline: '2026-04-29',
            isCompleted: true,
            tag: 'cá nhân',
            menuOpen: false,
        },
    ],
]);

// filter
let currentPriorityFilter = 'all';

function getFilteredTasks() {
    // Map không có .filter() trực tiếp
    // Nên chuyển values của Map thành Array trước
    const listItems = [...myMapItems.values()];

    if (currentPriorityFilter === 'all') {
        // return listItems;
        return listItems;
    }

    // return listItems.filter(item => item.priority === currentPriorityFilter);
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
});

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
                    <input 
                        class="task-card__input" 
                        id="checkbox-${item.id}" 
                        type="checkbox" 
                        data-id="${item.id}" 
                        ${item.isCompleted ? 'checked' : ''} 
                    />
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
                        <button class="task-card__dropdown-item" data-action="edit" data-id="${item.id}">
                            Sửa
                        </button>
                        <button class="task-card__dropdown-item task-card__dropdown-item--danger" data-action="delete" data-id="${item.id}">
                            Xóa
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    tasklist.innerHTML = html.join('');
}

renderTasks();

// filter: tất cả
filter.active.addEventListener('click', () => {
    currentPriorityFilter = 'all';
    setActiveFilterButton(filter.active);
    renderTasks();
});

// filter: cao
filter.high.addEventListener('click', () => {
    currentPriorityFilter = 'Cao';
    setActiveFilterButton(filter.high);
    renderTasks();
});

// filter: trung bình
filter.medium.addEventListener('click', () => {
    currentPriorityFilter = 'Trung bình';
    setActiveFilterButton(filter.medium);
    renderTasks();
});

// filter: thấp
filter.low.addEventListener('click', () => {
    currentPriorityFilter = 'Thấp';
    setActiveFilterButton(filter.low);
    renderTasks();
});

// checkbox hoàn thành task
document.getElementById('taskList').addEventListener('change', (e) => {
    if (e.target.classList.contains('task-card__input')) {
        const id = Number(e.target.dataset.id);
        const isChecked = e.target.checked;

        // CODE CŨ DÙNG ARRAY
        // const task = listItems.find(item => item.id === id);

        // CODE MỚI DÙNG MAP
        const task = myMapItems.get(id);

        if (task) {
            task.isCompleted = isChecked;
            myMapItems.set(id, task);
        }

        const taskCard = e.target.closest('.task-card');

        if (taskCard) {
            taskCard.classList.toggle('task-card--done', isChecked);
        }

        renderTasks();
    }
});

// đóng tất cả menu
function closeAllMenus() {
    // CODE CŨ DÙNG ARRAY
    // listItems.forEach(item => {
    //     item.menuOpen = false;
    // });

    // CODE MỚI DÙNG MAP
    myMapItems.forEach((item, id) => {
        item.menuOpen = false;
        myMapItems.set(id, item);
    });
}

// xử lý menu sửa / xóa / mở menu
tasklist.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const id = Number(actionBtn.dataset.id);
    const action = actionBtn.dataset.action;

    // CODE CŨ DÙNG ARRAY
    // const taskIndex = listItems.findIndex(item => item.id === id);
    // if (taskIndex === -1) return;

    // CODE MỚI DÙNG MAP
    const task = myMapItems.get(id);
    if (!task) return;

    if (action === 'toggle-menu') {
        // CODE CŨ DÙNG ARRAY
        // const task = listItems[taskIndex];

        const isOpen = !!task.menuOpen;

        closeAllMenus();

        task.menuOpen = !isOpen;
        myMapItems.set(id, task);

        renderTasks();
        return;
    }

    closeAllMenus();

    if (action === 'delete') {
        // CODE CŨ DÙNG ARRAY
        // listItems.splice(taskIndex, 1);
        // listItems = listItems.filter(item => item.id !== id);

        // CODE MỚI DÙNG MAP
        myMapItems.delete(id);

        renderTasks();
        return;
    }

    if (action === 'edit') {
        // CODE CŨ DÙNG ARRAY
        // const task = listItems[taskIndex];

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

// click ra ngoài thì đóng menu
document.addEventListener('click', (e) => {
    if (!e.target.closest('.task-card__menu-wrap')) {
        closeAllMenus();
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
    const editId = taskForm.dataset.editId ? Number(taskForm.dataset.editId) : null;

    if (editId) {
        // CODE CŨ DÙNG ARRAY
        // const task = listItems.find(item => item.id === editId);

        // CODE MỚI DÙNG MAP
        const task = myMapItems.get(editId);

        if (task) {
            task.name = name;
            task.priority = priority;
            task.deadline = deadline;
            task.tag = tag;

            myMapItems.set(editId, task);
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

        // CODE CŨ DÙNG ARRAY
        // listItems.push(newTask);

        // CODE MỚI DÙNG MAP
        myMapItems.set(newTask.id, newTask);
    }

    renderTasks();
    closeModal();
});

// xóa các task đã hoàn thành
const clearCompletedBtn = document.querySelector('.task-manager__action--delete');

clearCompletedBtn.addEventListener('click', () => {
    // CODE CŨ DÙNG ARRAY
    // for (let i = listItems.length - 1; i >= 0; i -= 1) {
    //     if (listItems[i].isCompleted) {
    //         listItems.splice(i, 1);
    //     }
    // }

    // CODE CŨ DÙNG ARRAY
    // listItems = listItems.filter(item => !item.isCompleted);

    // CODE MỚI DÙNG MAP
    for (const [id, item] of myMapItems) {
        if (item.isCompleted) {
            myMapItems.delete(id);
        }
    }

    renderTasks();
});