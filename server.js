import express from "express"; // Import the Express library

const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000; // Define the port for the server, defaulting to 3000

// Custom middleware to log the request method and URL
const showUrlAndMethod = (req, res, next) => {
  console.log(`${req.method} and ${req.url}`); // Log the HTTP method and URL
  next(); // Pass control to the next middleware function
};

// Use the custom middleware globally
app.use(showUrlAndMethod);

// Sample user data
const users = [
  { id: 1, name: "Dulitha", age: 23 },
  { id: 2, name: "Amila", age: 25 },
  { id: 3, name: "Kasun", age: 35 },
];

// Route to retrieve the list of users
app.get("/users", (req, res, next) => {
  console.log('Middleware One');
  next(); // Pass control to the next middleware function
}, (req, res, next) => {
  console.log('Middleware Two');
  next(); // Pass control to the next middleware function
}, (req, res) => {
  res.status(200).send(users); // Send the list of users with status 200
});

// Route to retrieve a specific user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const parsedId = parseInt(id, 10); // Parse the ID to an integer
  const user = users.find(u => u.id === parsedId); // Find the user with the matching ID

  if (user) {
    res.status(200).send(user); // Send user data with status 200
  } else {
    res.status(404).send({ message: "User not found" }); // Send 404 if user not found
  }
});

// Route to add a new user
app.post("/users", (req, res) => {
  const { body } = req; // Extract the request body
  const newUser = { id: users.length + 1, ...body }; // Create a new user with a unique ID
  users.push(newUser); // Add the new user to the users array
  res.status(200).send(users); // Send the updated list of users with status 200
});

// Route to update a user by ID (full update)
app.put("/users/:id", (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const { body } = req; // Extract the request body
  const parsedId = parseInt(id, 10); // Parse the ID to an integer
  const userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

  if (userIndex !== -1) {
    users[userIndex] = { id: parsedId, ...body }; // Update the user data
    res.status(200).send(users[userIndex]); // Send the updated user data
  } else {
    res.status(404).send({ message: "User not found" }); // Send 404 if user not found
  }
});

// Route to patch a user by ID (partial update)
app.patch("/users/:id", (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const { body } = req; // Extract the request body
  const parsedId = parseInt(id, 10); // Parse the ID to an integer
  const userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...body }; // Partially update the user data
    res.status(200).send(users[userIndex]); // Send the updated user data
  } else {
    res.status(404).send({ message: "User not found" }); // Send 404 if user not found
  }
});

// Route to delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Extract user ID from the request parameters
  const parsedId = parseInt(id, 10); // Parse the ID to an integer
  const userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

  if (userIndex !== -1) {
    users.splice(userIndex, 1); // Remove the user from the array
    res.status(200).send({ message: "User deleted successfully" }); // Send success message
  } else {
    res.status(404).send({ message: "User not found" }); // Send 404 if user not found
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message to indicate the server is running
});
