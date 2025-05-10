// Theme switcher
const toggleSwitch = document.querySelector('#checkbox');
const body = document.querySelector('body');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    toggleSwitch.checked = true;
}

// Switch theme function
toggleSwitch.addEventListener('change', function() {
    body.classList.toggle('light-mode', this.checked);
    localStorage.setItem('theme', this.checked ? 'light' : 'dark');
});

// Tabs functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
});

// Tasks functionality
function setupTaskList(inputId, listId, addBtnId, clearBtnId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const addBtn = document.getElementById(addBtnId);
    const clearBtn = document.getElementById(clearBtnId);
    const filterBtns = document.querySelectorAll(`.filter-btn[data-list="${listId.split('-')[1]}"]`);
    
    // Add task function
    function addTask() {
        const text = input.value.trim();
        if (text === '') return;
        
        const li = document.createElement('li');
        li.classList.add('task-item');
        
        const label = document.createElement('label');
        label.classList.add('task-label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        
        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = '🗑️';
        
        // Events
        checkbox.addEventListener('change', () => {
            span.classList.toggle('completed', checkbox.checked);
            applyFilter(currentFilter);
        });
        
        deleteBtn.addEventListener('click', () => {
            list.removeChild(li);
        });
        
        // Append elements
        label.appendChild(checkbox);
        label.appendChild(span);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        list.appendChild(li);
        
        // Clear input
        input.value = '';
        input.focus();
        
        // Apply current filter
        applyFilter(currentFilter);
    }
    
    // Add task events
    addBtn.addEventListener('click', addTask);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Clear completed
    clearBtn.addEventListener('click', () => {
        const items = list.querySelectorAll('.task-item');
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                list.removeChild(item);
            }
        });
    });
    
    // Filter functionality
    let currentFilter = 'all';
    
    function applyFilter(filter) {
        const items = list.querySelectorAll('.task-item');
        
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const isCompleted = checkbox && checkbox.checked;
            
            if (filter === 'all') {
                item.classList.remove('hide');
            } else if (filter === 'active') {
                item.classList.toggle('hide', isCompleted);
            } else if (filter === 'completed') {
                item.classList.toggle('hide', !isCompleted);
            }
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilter(currentFilter);
        });
    });
}

// Setup both task lists
setupTaskList('input-personal', 'list-personal', 'add-personal', 'clear-personal');
setupTaskList('input-professional', 'list-professional', 'add-professional', 'clear-professional');