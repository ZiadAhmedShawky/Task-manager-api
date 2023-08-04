# Task-Manager-API

This project is a Task Management System that allows users to organize and manage their tasks efficiently. It provides CRUD (Create, Read, Update, Delete) operations for tasks and offers features like task filtering, authentication, authorization, and error handling.

## Features

- Implement routes for handling CRUD operations on tasks, allowing users to add, view, modify, and remove tasks.
- Utilize MongoDB as the database to store and retrieve task data, ensuring persistent storage even after server restarts.
- Include authentication and authorization mechanisms to grant access to authorized users for task manipulation.
- Add task filtering options by status (completed or pending), due date, priority, and category for better organization.
- Implement error handling to provide informative responses for invalid requests or unexpected server errors, ensuring a smooth user experience.

## Installation

1. Clone the repository: `git clone https://github.com/ZiadAhmedShawky/Task-manager-api`
2. Navigate to the project directory: `cd task-manager-api`
3. Install dependencies: `npm install`

## Usage

1. Configure MongoDB connection in `config.js` with your MongoDB URI.
2. Run the server: `npm start`
3. Access the application in your browser: `http://localhost:3000`

## Authentication

To access and manage tasks, users need to create an account and log in. Unauthorized access is restricted.

## Filtering

Users can efficiently manage tasks by filtering them based on status, due date, priority, and category.

## Error Handling

The application handles invalid requests and unexpected errors gracefully, providing helpful error messages.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Authentication and Authorization Libraries (e.g., JWT)
- Error Handling Middleware

## Contributing

Contributions are welcome! Please create an issue or pull request for any improvements or features you'd like to add.

## License

This project is licensed under the [MIT License](LICENSE).
