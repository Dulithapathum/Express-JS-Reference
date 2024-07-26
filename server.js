import express from "express"; // Import the Express library

const app = express(); // Create an Express application
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

// Define a route for the home page
app.get("/", (req, res) => {
  // Send a response with status 200 and a message
  res.status(200).send("This is Home Page");
  // Log the URL that was accessed
  console.log(`Site Url: ${req.url}`);
});

// Define a route to get users with optional filtering
app.get("/users", (req, res) => {
  // Destructure the `filter` query parameter from the request
  const { filter } = req.query;

  // If no filter query parameter is provided, return a 400 status with an error message
  if (!filter) {
    return res.status(400).send("Filter query parameter is required.");
  }

  // Filter the users based on the `filter` query parameter
  const filterUser = users.filter((user) => {
    return user.name.trim() === filter.trim(); // Compare names after trimming any extra spaces
  });

  // If no users match the filter, return a 404 status with a not-found message
  if (filterUser.length === 0) {
    return res.status(404).send("No users found matching the filter.");
  } else {
    // Return the filtered users
    return res.send(filterUser);
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  // Log a message to indicate the server is running
  console.log(`Server is running on port ${PORT}`);
});
