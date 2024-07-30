import express from 'express'; // Import the Express library
import router from "./router.mjs"; // Import the router module that contains the route handlers

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(router); // Use the imported router for handling routes

const PORT = process.env.PORT || 3000; // Define the port for the server, defaulting to 3000

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message to indicate the server is running
});
