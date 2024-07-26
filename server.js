import express from "express"; // Import the Express library

const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000; // Define the port for the server, defaulting to 3000

// Sample user data
const users = [
  {
    id: 1,
    name: "dulitha ",
    age: 23,
  },
  {
    id: 2,
    name: "amila ",
    age: 25,
  },
  {
    id: 3,
    name: "kasun ",
    age: 35,
  },
];

// Define a route for retrieving the list of users
app.get("/users", (req, res) => {
  // Send the list of users with status 200
  res.status(200).send(users);
  // Log the URL that was accessed
  console.log(`Site Url: ${req.url}`);
});

// Define a route for adding a new user
app.post("/users", (req, res) => {
  // Extract the request body
  const { body } = req;

  // Create a new user object with a unique id
  const newUser = { id: users.length + 1, ...body };

  // Add the new user to the users array
  users.push(newUser);

  // Send the updated list of users with status 200
  return res.status(200).send(users);
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  // Log a message to indicate the server is running
  console.log(`Server is running on port ${PORT}`);
});
