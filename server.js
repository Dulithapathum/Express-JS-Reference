import express from 'express'; // Import the Express library
import { query, validationResult, body } from 'express-validator';

const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000; // Define the port for the server, defaulting to 3000

// Sample user data
const users = [
  { id: 1, name: 'Dulitha', age: 23 },
  { id: 2, name: 'Amila', age: 25 },
  { id: 3, name: 'Kasun', age: 35 },
];

// Route to retrieve the list of users, with optional filtering by name
app.get(
  '/users',
  query('name').isString().withMessage('Name must be a string').isEmpty(),
  (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { name } = req.query; // Extract the 'name' query parameter from the request
    // Filter users by name if the query parameter is provided
    const filteredUsers = name
      ? users.filter(user => user.name.toLowerCase() === name.toLowerCase())
      : users;

    res.status(200).json(filteredUsers); // Send the filtered list of users
  }
);

// Route to retrieve a specific user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const parsedId = parseInt(id, 10); // Parse the ID to an integer
  const user = users.find(u => u.id === parsedId); // Find the user with the matching ID

  if (user) {
    res.status(200).json(user); // Send user data with status 200
  } else {
    res.status(404).json({ message: 'User not found' }); // Send 404 if user not found
  }
});

// Route to add a new user
app.post(
  '/users',
  body('name').isString().withMessage('Name must be a string'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { body } = req; // Extract the request body
    const newUser = { id: users.length + 1, ...body }; // Create a new user with a unique ID
    users.push(newUser); // Add the new user to the users array
    res.status(201).json(newUser); // Send the newly created user with status 201
  }
);

// Route to update a user by ID (full update)
app.put(
  '/users/:id',
  body('name').optional().isString().withMessage('Name must be a string'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { id } = req.params; // Extract user ID from the request parameters
    const { body } = req; // Extract the request body
    const parsedId = parseInt(id, 10); // Parse the ID to an integer
    const userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

    if (userIndex !== -1) {
      users[userIndex] = { id: parsedId, ...body }; // Update the user data
      res.status(200).json(users[userIndex]); // Send the updated user data
    } else {
      res.status(404).json({ message: 'User not found' }); // Send 404 if user not found
    }
  }
);

// Route to patch a user by ID (partial update)
app.patch(
  '/users/:id',
  body('name').optional().isString().withMessage('Name must be a string'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { id } = req.params; // Extract user ID from the request parameters
    const { body } = req; // Extract the request body
    const parsedId = parseInt(id, 10); // Parse the ID to an integer
    const userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...body }; // Partially update the user data
      res.status(200).json(users[userIndex]); // Send the updated user data
    } else {
      res.status(404).json({ message: 'User not found' }); // Send 404 if user not found
    }
  }
);

// Route to delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const parsedId = parseInt(id, 10); // Parse the ID to an integer
  const userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

  if (userIndex !== -1) {
    users.splice(userIndex, 1); // Remove the user from the array
    res.status(200).json({ message: 'User deleted successfully' }); // Send success message
  } else {
    res.status(404).json({ message: 'User not found' }); // Send 404 if user not found
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message to indicate the server is running
});
