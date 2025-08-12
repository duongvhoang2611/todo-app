# OWL Todo App

A simple Todo List application built using the OWL framework.

## **Features**

- Add new tasks
- Toggle task completion
- Delete tasks
- Filter tasks by completion status (all, active, completed)

## **Getting Started**

1. Clone the repository: `git clone https://github.com/your-username/owl_framework_todoapp.git`
2. Start the application: use a local server (e.g., with VS Code’s **“Live Server”** extension)

## **Application Structure**

- `app.js`: The main application file, containing the OWL component definitions and application logic.
- `app.css`: The application stylesheet, defining the visual layout and design.
- `index.html`: The entry point of the application, loading the OWL framework and mounting the application.

## **Components**

- [Task](cci:2://file:///g:/Workspaces/ATS/dev/odoo_18_own/owl_framework/todoapp/app.js:62:2-93:3): Represents a single task, with a checkbox, label, and delete button.
- [TaskList](cci:2://file:///g:/Workspaces/ATS/dev/odoo_18_own/owl_framework/todoapp/app.js:22:2-48:3): Manages the list of tasks, providing methods for adding, toggling, and deleting tasks.
- [Root](cci:2://file:///g:/Workspaces/ATS/dev/odoo_18_own/owl_framework/todoapp/app.js:98:2-172:3): The top-level component, containing the task list, input field, and filter buttons.

## **Store**

The application uses a simple store to manage the task data, implemented using the OWL `useState` hook.
