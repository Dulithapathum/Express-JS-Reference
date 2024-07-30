import { Router } from "express"; // Import the Router class from Express to create route handlers
import { query, validationResult, body } from 'express-validator'; // Import validation functions from express-validator
import { users } from "./user.mjs"; // Import the user data (users array) from the user module

const router = Router(); // Create a new router instance

// Route to retrieve users, with optional filtering by name
router.get('/users',
  query('name').optional().isString().withMessage('Name must be a string'), // Validate 'name' query parameter if provided
  (req, res) => {
    const result = validationResult(req); // Check for validation errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() }); // Send validation errors if any
    }

    const { name } = req.query; // Extract the 'name' query parameter
    // Filter users by name if the query parameter is provided
    const filteredUsers = name
      ? users.filter(user => user.name.toLowerCase() === name.toLowerCase())
      : users; // Return all users if no filter

    res.status(200).json(filteredUsers); // Respond with the filtered list of users
  });

// Route to retrieve a specific user by ID
router.get('/users/:id', (req, res) => {
    const { id } = req.params; // Extract user ID from the request parameters
    const parsedId = parseInt(id, 10); // Convert ID to an integer
    const user = users.find(u => u.id === parsedId); // Find user with the specified ID
  
    if (user) {
      res.status(200).json(user); // Send user data if found
    } else {
      res.status(404).json({ message: 'User not found' }); // Send 404 status if user is not found
    }
  });

// Route to add a new user
router.post(
    '/users',
    body('name').isString().withMessage('Name must be a string'), // Validate 'name' as a string
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'), // Validate 'age' as a positive integer
    (req, res) => {
      const result = validationResult(req); // Check for validation errors
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() }); // Send validation errors if any
      }
  
      const { name, age } = req.body; // Extract the request body
      const newUser = { id: users.length + 1, name, age }; // Create a new user with a unique ID
      users.push(newUser); // Add the new user to the array
      res.status(201).json(newUser); // Respond with the newly created user
    }
  );

// Route to update a user by ID (full update)
router.put(
    '/users/:id',
    body('name').optional().isString().withMessage('Name must be a string'), // Optionally validate 'name' as a string
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'), // Optionally validate 'age' as a positive integer
    (req, res) => {
      const result = validationResult(req); // Check for validation errors
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() }); // Send validation errors if any
      }
  
      const { id } = req.params; // Extract user ID from the request parameters
      const { name, age } = req.body; // Extract the request body
      const parsedId = parseInt(id, 10); // Convert ID to an integer
      const userIndex = users.findIndex(u => u.id === parsedId); // Find the index of the user
  
      if (userIndex !== -1) {
        users[userIndex] = { id: parsedId, name, age }; // Update user data
        res.status(200).json(users[userIndex]); // Respond with the updated user data
      } else {
        res.status(404).json({ message: 'User not found' }); // Send 404 status if user is not found
      }
    }
  );

// Route to patch (partially update) a user by ID
router.patch(
    '/users/:id',
    body('name').optional().isString().withMessage('Name must be a string'), // Optionally validate 'name' as a string
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer'), // Optionally validate 'age' as a positive integer
    (req, res) => {
      const result = validationResult(req); // Check for validation errors
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() }); // Send validation errors if any
      }
  
      const { id } = req.params; // Extract user ID from the request parameters
      const { name, age } = req.body; // Extract the request body
      const parsedId = parseInt(id, 10); // Convert ID to an integer
      const userIndex = users.findIndex(u => u.id === parsedId); // Find the index of the user
  
      if (userIndex !== -1) {
        // Partially update user data
        users[userIndex] = { ...users[userIndex], name, age };
        res.status(200).json(users[userIndex]); // Respond with the updated user data
      } else {
        res.status(404).json({ message: 'User not found' }); // Send 404 status if user is not found
      }
    }
  );

// Route to delete a user by ID
router.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const parsedId = parseInt(id, 10); // Convert ID to an integer
  const userIndex = users.findIndex(u => u.id === parsedId); // Find the index of the user

  if (userIndex !== -1) {
    users.splice(userIndex, 1); // Remove the user from the array
    res.status(200).json({ message: 'User deleted successfully' }); // Respond with a success message
  } else {
    res.status(404).json({ message: 'User not found' }); // Send 404 status if user is not found
  }
});

// Global error handler
router.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(500).json({ message: 'Something went wrong!' }); // Respond with a 500 status and a generic error message
});

export default router; // Export the router instance as the default export
