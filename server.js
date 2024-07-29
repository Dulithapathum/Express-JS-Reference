import express from "express"; // Import the Express library

const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000; // Define the port for the server, defaulting to 3000

// Sample user data
const users = [
  { id: 1, name: "Dulitha", age: 23 },
  { id: 2, name: "Amila", age: 25 },
  { id: 3, name: "Kasun", age: 35 },
];

// Middleware to log request method and URL
const showUrlAndMethod = (req, res, next) => {
  console.log(`${req.method} and ${req.url}`);
  next();
};

// Middleware to extract and validate user ID
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  req.userId = parsedId; // Attach the parsed ID to the request object
  req.userIndex = users.findIndex(u => u.id === parsedId); // Find the user index

  next(); // Pass control to the next middleware or route handler
};

app.use(showUrlAndMethod);

// Route to retrieve the list of users
app.get("/users", (req, res) => {
  res.status(200).send(users); // Send the list of users with status 200
});

// Route to retrieve a specific user by ID
app.get("/users/:id", validateUserId, (req, res) => {
  const user = users.find(u => u.id === req.userId);

  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Route to update a user by ID (full update)
app.put("/users/:id", validateUserId, (req, res) => {
  const { body } = req;

  if (req.userIndex !== -1) {
    users[req.userIndex] = { id: req.userId, ...body };
    res.status(200).send(users[req.userIndex]);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Route to patch a user by ID (partial update)
app.patch("/users/:id", validateUserId, (req, res) => {
  const { body } = req;

  if (req.userIndex !== -1) {
    users[req.userIndex] = { ...users[req.userIndex], ...body };
    res.status(200).send(users[req.userIndex]);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Route to delete a user by ID
app.delete('/users/:id', validateUserId, (req, res) => {
  if (req.userIndex !== -1) {
    users.splice(req.userIndex, 1);
    res.status(200).send({ message: "User deleted successfully" });
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
