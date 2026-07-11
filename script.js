const taskInput = document.getElementById('taskInput'); 
const dateInput = document.getElementById('dateInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const clearBtn = document.getElementById('clearBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let search = '';

const save = () => localStorage.setItem('tasks', JSON.stringify(tasks));
const priorityRank = { high: 1, medium: 2, low: 3 };

function render() {
  taskList.innerHTML = '';
  tasks
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()))
    .forEach(t => {
      const li = document.createElement('li');
      li.className = `${t.priority}${t.done ? ' done' : ''}`;
      li.innerHTML = `
        <button class="icon-btn" data-act="toggle" title="Complete">${t.done ? '↺' : '✓'}</button>

        <div class="task-text">
          ${t.text}
          ${t.date ? `<div class="task-date">📅 ${t.date}</div>` : ''}
           <div class="task-date">⚡ ${t.priority}</div>
        </div>

        <!-- EDIT BUTTON -->
        <button class="icon-btn" data-act="edit" title="Edit">✏️</button>

        <button class="icon-btn" data-act="del" title="Delete">🗑</button>
      `;

      // toggle
      li.querySelector('[data-act=toggle]').onclick = () => {
        t.done = !t.done; save(); render();
      };

      // delete
      li.querySelector('[data-act=del]').onclick = () => {
        li.classList.add('removing');
        setTimeout(() => {
          tasks = tasks.filter(x => x.id !== t.id);
          save(); render();
        }, 320);
      };

      // edit (ONLY ADDED FEATURE)
      li.querySelector('[data-act=edit]').onclick = () => {
        const newText = prompt('Edit your task:', t.text);
        if (newText !== null && newText.trim() !== '') {
          t.text = newText.trim();
          save();
          render();
        }
      };

      taskList.appendChild(li);
    });
}

// ripple animation
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(r.width, r.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
  ripple.style.top  = (e.clientY - r.top  - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

addBtn.onclick = () => {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.style.animation = 'none';
    taskInput.offsetHeight;
    taskInput.style.animation = 'shake .4s';
    return;
  }
  tasks.push({
    id: Date.now(),
    text,
    date: dateInput.value,
    priority: priorityInput.value,
    done: false
  });
  save(); render();
  taskInput.value = ''; 
  dateInput.value = '';
};

searchInput.oninput = (e) => { search = e.target.value; render(); };

sortBtn.onclick = () => {
  tasks.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  save(); render();
};

clearBtn.onclick = () => {
  if (!tasks.length) return;
  if (confirm('Clear all tasks?')) { tasks = []; save(); render(); }
};

// shake animation
const style = document.createElement('style');
style.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-8px)}
  75%{transform:translateX(8px)}
}`;
document.head.appendChild(style);

render();