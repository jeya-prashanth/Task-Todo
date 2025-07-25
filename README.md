# Todo App

A modern, responsive Todo application with user authentication and task management, built with vanilla JavaScript, HTML, and CSS. The application features a clean, intuitive interface and works entirely in the browser using localStorage for data persistence.

## Features

- **User Authentication**
  - Sign up with email and password
  - Log in/out functionality
  - User profile management

- **Task Management**
  - Add new tasks
  - Mark tasks as complete
  - Delete tasks
  - View recent tasks

- **User Profile**
  - Update profile information
  - Change password
  - View account details

- **Responsive Design**
  - Works on desktop, tablet, and mobile devices
  - Clean, modern UI with smooth animations

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or database setup required

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jeya-prashanth/Task-Todo
   cd Task-Todo
   ```

2. Open `index.html` in your web browser:
   ```bash
   # For Windows
   start frontend/index.html

   # For macOS
   open frontend/index.html

   # For Linux
   xdg-open frontend/index.html
   ```

### Data Structure

- **Users**
  ```javascript
  {
    id: 'unique-user-id',
    email: 'user@example.com',
    full_name: 'User Name',
    created_at: 'ISO date string'
  }
  ```

- **Tasks**
  ```javascript
  {
    id: 'unique-task-id',
    userId: 'user-id',
    title: 'Task title',
    completed: false,
    createdAt: 'ISO date string',
    updatedAt: 'ISO date string'
  }
  ```
- **Run**
 ```bash
 docker-compose up --build
 ```
