import express from "express"; // Import the Express library

const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000; // Define the port for the server, defaulting to 3000

// Sample user data
const users = [
  {
    id: 1,
    name: "Dulitha",
    age: 23,
  },
  {
    id: 2,
    name: "Amila",
    age: 25,
  },
  {
    id: 3,
    name: "Kasun",
    age: 35,
  },
];

// Route to retrieve the list of users
app.get("/users", (req, res) => {
  res.status(200).send(users); // Send the list of users with status 200
  console.log(`Site URL: ${req.url}`); // Log the accessed URL
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


// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message to indicate the server is running
});
