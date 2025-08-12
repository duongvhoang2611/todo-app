import {
  Component,
  mount,
  onMounted,
  reactive,
  useEnv,
  useRef,
  useState,
  xml,
} from 'https://cdn.jsdelivr.net/npm/@odoo/owl@2.8.0/+esm';
(() => {
  // -------------------------------------------------------------------------
  // Store
  // -------------------------------------------------------------------------
  function useStore() {
    const env = useEnv();
    return useState(env.store);
  }

  // -------------------------------------------------------------------------
  // TaskList
  // -------------------------------------------------------------------------
  class TaskList {
    constructor(initialTasks) {
      this.tasks = initialTasks || [];
      const taskIds = this.tasks.map((t) => t.id);
      this.nextId = taskIds.length ? Math.max(...taskIds) + 1 : 1;
    }

    addTask(inputValue) {
      if (inputValue) {
        const newTask = {
          id: this.nextId++,
          text: inputValue,
          isCompleted: false,
        };
        this.tasks.push(newTask);
      }
    }

    toggleTask(task) {
      task.isCompleted = !task.isCompleted;
    }

    deleteTask(task) {
      const index = this.tasks.findIndex((t) => t.id === task.id);
      this.tasks.splice(index, 1);
    }
  }

  function createTaskStore() {
    const saveTasks = () =>
      localStorage.setItem('todoApp', JSON.stringify(taskStore.tasks));
    const initialTasks = JSON.parse(localStorage.getItem('todoApp') || '[]');
    const taskStore = reactive(new TaskList(initialTasks), saveTasks);
    saveTasks();
    return taskStore;
  }

  // -------------------------------------------------------------------------
  // Task Component
  // -------------------------------------------------------------------------
  class Task extends Component {
    static template = xml`
    <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
      <input
        type="checkbox"
        t-att-id="props.task.id"
        t-att-checked="props.task.isCompleted"
        t-on-change="() => store.toggleTask(props.task)"
        arial-label="Mark task as completed"
      />
      <label t-att-for="props.task.id" class="task-label">
        <t t-esc="props.task.text"/>
      </label>
      <button
        type="button"
        class="delete-btn"
        t-on-click="() => store.deleteTask(props.task)"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/>
        </svg>
      </button>
    </div>
  `;

    static props = ['task'];

    setup() {
      this.store = useStore();
    }
  }

  // -------------------------------------------------------------------------
  // Root Component
  // -------------------------------------------------------------------------
  class Root extends Component {
    static template = xml`
    <div class="todo-app">
      <input
        class="todo-input"
        type="text"
        placeholder="Enter a new task"
        aria-label="New task"
        t-on-keyup="addTask"
        t-ref="input"
      />
      <div class="task-list">
          <t t-foreach="displayedTasks" t-as="task" t-key="task.id">
            <Task task="task" />
          </t>
      </div>
      <div class="task-panel" t-if="store.tasks.length">
        <div class="task-counter">
          <span>
            <t t-esc="displayedTasks.length"/>
            <t t-if="displayedTasks.length lt store.tasks.length">
              / <t t-esc="store.tasks.length"/>
            </t>
            task(s)
          </span>
        </div>
        <div>
          <span
            t-foreach="this.filters"
            t-as="f"
            t-key="f"
            t-att-class="{ active: this.filter.value === f }"
            t-att-data-filter="f"
            t-on-click="onFilterClick"
            t-esc="f"/>
        </div>
      </div>
    </div>
  `;

    static components = { Task };

    setup() {
      const inputRef = useRef('input');
      onMounted(() => {
        inputRef.el.focus();
      });
      this.store = useStore();
      this.filter = useState({ value: 'all' });
      this.filters = ['all', 'active', 'completed'];
    }

    get displayedTasks() {
      const tasks = this.store.tasks;
      switch (this.filter.value) {
        case 'active':
          return tasks.filter((t) => !t.isCompleted);
        case 'completed':
          return tasks.filter((t) => t.isCompleted);
        case 'all':
          return tasks;
      }
    }

    onFilterClick(e) {
      this.filter.value = e.target.dataset.filter;
    }

    addTask(e) {
      if (e.keyCode === 13) {
        this.store.addTask(e.target.value.trim());
        e.target.value = '';
      }
    }
  }

  // -------------------------------------------------------------------------
  // Setup
  // -------------------------------------------------------------------------
  const env = {
    store: createTaskStore(),
  };

  mount(Root, document.body, { dev: true, env });
})();
