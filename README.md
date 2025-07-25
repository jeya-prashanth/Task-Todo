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
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
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

## Project Structure

```
frontend/
├── assets/
│   ├── css/           # Stylesheets
│   └── js/            # JavaScript files
├── auth/              # Authentication pages
├── dashboard.html     # Main application
├── profile.html       # User profile
└── index.html         # Landing page
```

## How It Works

The application uses the browser's localStorage to persist data, including:
- User authentication state
- User profile information
- Task data

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

## Development

To modify or extend the application:

1. Edit the relevant HTML, CSS, or JavaScript files in the `frontend` directory
2. Test your changes by opening the corresponding HTML file in a web browser
3. The application will automatically use localStorage for data persistence

## Browser Support

The application is tested and works on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

This project is open source and available under the [MIT License](LICENSE).
